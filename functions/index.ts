/**
 * IMPORTANT: You will need to deploy this code to Firebase Functions.
 * 1. Navigate to the `functions` directory in your terminal.
 * 2. Run `npm install` to install dependencies.
 * 3. Set your Google AI API Key in the Firebase environment:
 *    firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY"
 * 4. Deploy the functions:
 *    firebase deploy --only functions
 */

// Fix: Use v1 compat library to match function syntax and resolve type errors.
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { GoogleGenAI, Type } from "@google/genai";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { ObjectMetadata } from "firebase-functions/v1/storage";
// We need to use a dynamic import for epub-parser as it's an ESM module
const ePubParser = import("epub-parser");

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// Get Gemini API Key from Firebase environment config
const geminiApiKey = functions.config().gemini.key;
if (!geminiApiKey) {
  console.error(
    "Gemini API key not set. " +
    "Run 'firebase functions:config:set gemini.key=\"YOUR_API_KEY\"'"
  );
}
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const CHUNK_SIZE = 40000;

// (Code for schema, system instruction, merging, etc. would go here,
// similar to the original geminiService.ts but adapted for Node.js)
// This is a simplified version for demonstration.

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        characters: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, first_appearance_context: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }, source_quote: { type: Type.STRING } } } },
        plot_points: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }, source_quote: { type: Type.STRING } } } },
        magic_items: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, abilities: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }, source_quote: { type: Type.STRING } } } },
        locations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, significance: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }, source_quote: { type: Type.STRING } } } },
        battles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING }, description: { type: Type.STRING }, participants: { type: Type.ARRAY, items: { type: Type.STRING } }, outcome: { type: Type.STRING }, links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } }, source_quote: { type: Type.STRING } } } },
    },
};
// NOTE: A more robust implementation would fetch existing data to provide context.
const getSystemInstruction = () => `You are an expert analyst of "The Wandering Inn" series... (full prompt omitted for brevity, but would be the same as the client-side version)`;


async function extractTextFromFile(object: ObjectMetadata): Promise<string> {
    const bucket = storage.bucket(object.bucket);
    const filePath = object.name;
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    await bucket.file(filePath).download({ destination: tempFilePath });

    if (fileName.endsWith(".txt")) {
        return fs.readFileSync(tempFilePath, "utf8");
    } else if (fileName.endsWith(".epub")) {
        const parser = await ePubParser;
        const epub = await parser.parse(tempFilePath);
        // This is a simplified text extraction for EPUB on Node.js
        return epub.sections.map((s) => s.raw.replace(/<[^>]*>?/gm, "")).join("\n\n");
    }

    fs.unlinkSync(tempFilePath); // Clean up
    throw new Error(`Unsupported file type for ${fileName}`);
}

// Fix: Use ES module 'export const' syntax instead of CommonJS 'exports.onFileFinalized' to resolve "Cannot find name 'exports'" error.
export const onFileFinalized = functions.storage.object().onFinalize(async (object) => {
    const filePath = object.name;
    if (!filePath || !filePath.startsWith("uploads/")) {
        return functions.logger.log("Not a user upload. Exiting.");
    }

    const parts = filePath.split("/");
    const uid = parts[1];
    const fileName = parts[2];

    const userDocRef = db.collection("users").doc(uid);

    try {
        // 1. Add file to sources list immediately
        const sourceId = admin.firestore.Timestamp.now().toMillis().toString();
        const newSource = { id: sourceId, name: fileName, type: object.contentType };
        await userDocRef.set({
            sources: admin.firestore.FieldValue.arrayUnion(newSource),
        }, { merge: true });

        // 2. Extract text from file
        const text = await extractTextFromFile(object);

        // 3. Process text with Gemini
        const chunks = text.match(new RegExp(`.{1,${CHUNK_SIZE}}`, "gs")) || [];
        
        let combinedData: any = {}; // Simplified merge target

        for (const chunk of chunks) {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: chunk,
                config: {
                    systemInstruction: getSystemInstruction(),
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            const chunkData = JSON.parse(response.text);

            // In a real app, you would merge this data intelligently.
            // This is a simplified "last write wins" merge for demonstration.
            for (const key in chunkData) {
                if(chunkData[key].length > 0) {
                   if (!combinedData[key]) combinedData[key] = [];
                   // Add source citation to every entity
                   chunkData[key].forEach((item: any) => {
                       item.citations = [{ sourceId: sourceId, snippet: item.source_quote }];
                       delete item.source_quote;
                   });
                   combinedData[key].push(...chunkData[key]);
                }
            }
        }
        
        // 4. Update Firestore with new encyclopedia data
        const updatePayload: { [key: string]: any } = {};
        for(const key in combinedData) {
             updatePayload[`encyclopedia.${key}`] = admin.firestore.FieldValue.arrayUnion(...combinedData[key]);
        }
        
        // NOTE: A robust implementation would use a transaction and smarter merging logic
        // to handle deduplication and linking.
        await userDocRef.set(updatePayload, { merge: true });

        return functions.logger.log(`Successfully processed ${fileName} for user ${uid}.`);
    } catch (error) {
        functions.logger.error(`Error processing file for ${uid}:`, error);
        // Optionally, update Firestore with an error state
        return null;
    }
});


// Fix: Use ES module 'export const' syntax instead of CommonJS 'exports.resetUserData' to resolve "Cannot find name 'exports'" error.
export const resetUserData = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const uid = context.auth.uid;
    const userDocRef = db.collection("users").doc(uid);
    const bucket = admin.storage().bucket();
    const path = `uploads/${uid}/`;

    try {
        // Delete Firestore document
        await userDocRef.delete();
        // Delete all files in Cloud Storage folder
        await bucket.deleteFiles({ prefix: path });

        return { success: true, message: `All data for user ${uid} has been deleted.` };
    } catch (error) {
        functions.logger.error(`Error resetting data for user ${uid}`, error);
        throw new functions.https.HttpsError("internal", "Could not reset user data.");
    }
});
