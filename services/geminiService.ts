import { GoogleGenAI, Type } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import * as dbService from './dbService';
import { IndexData, Category, BaseEntity, SourceFile } from '../types';

// Extend the Window interface for epub.js
declare global {
  interface Window {
    ePub: any;
  }
}

// =================================================================
// REAL, CLIENT-SIDE GEMINI & FILE PROCESSING SERVICE
// =================================================================

const CHUNK_SIZE = 40000; // Characters per chunk
const CONCURRENT_REQUESTS = 5;
const MAX_RETRIES = 3;

let ai: GoogleGenAI;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        characters: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    first_appearance_context: { type: Type.STRING },
                    links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                    source_quote: { type: Type.STRING },
                },
                required: ["id", "name", "description", "first_appearance_context", "links", "source_quote"]
            }
        },
        plot_points: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                    source_quote: { type: Type.STRING },
                },
                required: ["id", "name", "description", "links", "source_quote"]
            }
        },
        magic_items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    abilities: { type: Type.STRING },
                    links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                    source_quote: { type: Type.STRING },
                },
                required: ["id", "name", "description", "abilities", "links", "source_quote"]
            }
        },
        locations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    significance: { type: Type.STRING },
                    links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                    source_quote: { type: Type.STRING },
                },
                required: ["id", "name", "description", "significance", "links", "source_quote"]
            }
        },
        battles: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    participants: { type: Type.ARRAY, items: { type: Type.STRING } },
                    outcome: { type: Type.STRING },
                    links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, name: { type: Type.STRING } } } },
                    source_quote: { type: Type.STRING },
                },
                required: ["id", "name", "description", "participants", "outcome", "links", "source_quote"]
            }
        },
    }
};

const getSystemInstruction = (existingData: IndexData) => {
    const existingCharacters = existingData.characters.map(c => `id: "${c.id}", name: "${c.name}"`).join('; ');
    const existingLocations = existingData.locations.map(l => `id: "${l.id}", name: "${l.name}"`).join('; ');
    const existingItems = existingData.magic_items.map(i => `id: "${i.id}", name: "${i.name}"`).join('; ');
    const existingBattles = existingData.battles.map(b => `id: "${b.id}", name: "${b.name}"`).join('; ');

    return `You are an expert analyst of "The Wandering Inn" series by pirateaba. Your task is to extract detailed information from the provided text and structure it as a JSON object.

    **Instructions:**
    1.  **Analyze Entities:** Identify all characters, major plot points, magic items, significant locations, and battles within the text.
    2.  **Generate Unique IDs:** For each NEW entity you identify, create a unique, stable ID using the format "category-name-in-kebab-case". For example, a character named "Erin Solstice" would have an ID like "characters-erin-solstice".
    3.  **Use Existing IDs:** Before creating a new ID, check the provided lists of existing entities. If an entity you find in the text matches an existing one, you MUST use its existing ID. This is crucial for linking data correctly.
        - Existing Characters: ${existingCharacters || 'None'}
        - Existing Locations: ${existingLocations || 'None'}
        - Existing Magic Items: ${existingItems || 'None'}
        - Existing Battles: ${existingBattles || 'None'}
    4.  **Create Links:** For each entity, identify its relationships with other entities (characters, locations, items, battles) mentioned in the text. Add these relationships to the "links" array, using their respective IDs and names.
    5.  **Provide Source Quotes:** For every single entity you create, you MUST provide a direct quote from the text in the "source_quote" field that justifies its creation or description. This is a mandatory field.
    6.  **Detailed Descriptions:** Write comprehensive but concise descriptions. For characters, describe their motivations and relationships. For locations, describe their significance. For plot points, describe their cause and effect.
    7.  **Output JSON:** Adhere strictly to the provided JSON schema. Do not output anything other than the JSON object.

    Your goal is to build a rich, interconnected knowledge graph from the text. Be meticulous and accurate.`;
};

async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'text/plain') {
        return file.text();
    } else if (file.name.endsWith('.epub')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    if (!event.target?.result) {
                        reject(new Error("Failed to read EPUB file."));
                        return;
                    }
                    const book = window.ePub(event.target.result as ArrayBuffer);
                    const spine = await book.spine.ready;
                    let textContent = '';
                    
                    for (const section of spine) {
                        const contents = await section.load();
                        const text = contents.textContent?.trim();
                        if (text) {
                            textContent += text + '\n\n';
                        }
                    }
                    resolve(textContent);
                } catch (err) {
                    console.error("Error processing EPUB file:", err);
                    const message = err instanceof Error ? err.message : String(err);
                    reject(new Error(`Error processing EPUB file "${file.name}": ${message}. The file may be corrupted, protected by DRM, or in an unsupported format.`));
                }
            };
            reader.onerror = () => reject(new Error('File could not be read.'));
            reader.readAsArrayBuffer(file);
        });
    }
    throw new Error(`Unsupported file type: ${file.type}`);
}


async function analyzeChunk(chunk: string, existingData: IndexData, sourceId: string, retries = MAX_RETRIES): Promise<any> {
    try {
        const model = getAI();
        const response = await model.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: chunk,
            config: {
                systemInstruction: getSystemInstruction(existingData),
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        // Add source citation to every entity
        Object.values(data).forEach((category: any) => {
            if (Array.isArray(category)) {
                category.forEach(item => {
                    item.citations = [{ sourceId: sourceId, snippet: item.source_quote }];
                    delete item.source_quote;
                });
            }
        });
        return data;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            await new Promise(res => setTimeout(res, (MAX_RETRIES - retries + 1) * 2000)); // Exponential backoff
            return analyzeChunk(chunk, existingData, sourceId, retries - 1);
        } else {
            throw new Error("Failed to process text with the AI model after multiple retries. The API may be unavailable or the request may have been blocked.");
        }
    }
}

function mergeData(existingData: IndexData, newData: Partial<IndexData>): IndexData {
    const mergedData: IndexData = JSON.parse(JSON.stringify(existingData));
    const entityMap = new Map<string, BaseEntity>();

    // Pre-populate map with existing entities for easy lookup
    Object.values(mergedData).forEach(category => category.forEach(item => entityMap.set(item.id, item)));

    for (const categoryKey of Object.keys(newData) as (keyof IndexData)[]) {
        const newItems = newData[categoryKey] || [];
        if (!mergedData[categoryKey]) {
            mergedData[categoryKey] = [] as any;
        }

        for (const newItem of newItems) {
            if (entityMap.has(newItem.id)) {
                // Merge into existing entity
                const existingItem = entityMap.get(newItem.id)!;
                Object.assign(existingItem, {
                    ...newItem,
                    links: [...new Set([...(existingItem.links || []), ...(newItem.links || [])].map(l => l.id))].map(id => (newItem.links.find(l => l.id === id) || existingItem.links.find(l => l.id === id))!),
                    citations: [...new Set([...(existingItem.citations || []), ...(newItem.citations || [])].map(c => c.snippet))].map(snippet => (newItem.citations.find(c => c.snippet === snippet) || existingItem.citations.find(c => c.snippet === snippet))!),
                });
            } else {
                // Add new entity
                (mergedData[categoryKey] as BaseEntity[]).push(newItem);
                entityMap.set(newItem.id, newItem);
            }
        }
    }
    return mergedData;
}

function buildBacklinks(data: IndexData): IndexData {
    const entityMap = new Map<string, { entity: BaseEntity, category: Category }>();
    for (const category of Object.keys(data) as Category[]) {
        data[category].forEach(item => {
            entityMap.set(item.id, { entity: item, category });
        });
    }

    for (const { entity, category } of entityMap.values()) {
        for (const link of entity.links) {
            const target = entityMap.get(link.id);
            if (target) {
                const backlinkExists = target.entity.links.some(l => l.id === entity.id);
                if (!backlinkExists) {
                    target.entity.links.push({ id: entity.id, name: entity.name, category });
                }
            }
        }
    }
    return data;
}


export async function processFiles(files: FileList, currentData: IndexData | null, onProgress: (message: string) => void): Promise<{ updatedData: IndexData, updatedSources: SourceFile[] }> {
    let combinedData: IndexData = currentData || { characters: [], plot_points: [], magic_items: [], monsters: [], battles: [], locations: [] };

    // Step 1: Save new sources to the database first
    const newSources: SourceFile[] = [];
    for (const file of Array.from(files)) {
        const source: SourceFile = {
            id: uuidv4(),
            name: file.name,
            type: file.type,
        };
        newSources.push(source);
    }
    await dbService.saveSources(newSources);
    const allSources = await dbService.loadSources();


    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const source = newSources[i];
        
        onProgress(`Reading file: ${file.name} (${i + 1}/${files.length})`);

        let text;
        try {
            text = await extractTextFromFile(file);
        } catch(e) {
            console.error(e);
            throw e;
        }

        const chunks = text.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'gs')) || [];
        onProgress(`Analyzing ${file.name} in ${chunks.length} chunks...`);

        for (let j = 0; j < chunks.length; j += CONCURRENT_REQUESTS) {
            const batch = chunks.slice(j, j + CONCURRENT_REQUESTS);
            onProgress(`Analyzing chunk batch ${Math.floor(j / CONCURRENT_REQUESTS) + 1}/${Math.ceil(chunks.length / CONCURRENT_REQUESTS)} of ${file.name}`);
            
            const promises = batch.map(chunk => analyzeChunk(chunk, combinedData, source.id));
            const results = await Promise.allSettled(promises);

            results.forEach(result => {
                if (result.status === 'fulfilled' && result.value) {
                    combinedData = mergeData(combinedData, result.value);
                } else if (result.status === 'rejected') {
                    console.error("A chunk failed to process:", result.reason);
                    // Continue with partial data
                }
            });
        }
    }
    
    onProgress("Finalizing knowledge graph...");
    combinedData = buildBacklinks(combinedData);
    
    // Assign chronological order to new plot points
    const maxOrder = Math.max(0, ...combinedData.plot_points.map(p => p.chronological_order || 0));
    let currentOrder = maxOrder + 1;
    combinedData.plot_points.forEach(p => {
        if (!p.chronological_order) {
            p.chronological_order = currentOrder++;
        }
    });

    onProgress("Saving updated encyclopedia to your browser...");
    await dbService.saveEncyclopedia(combinedData);

    onProgress("Analysis Complete!");

    return { updatedData: combinedData, updatedSources: allSources };
}
