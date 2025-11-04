import { auth, db, storage, functions } from './firebaseService';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
import { IndexData, SourceFile } from '../types';

// =================================================================
// FIREBASE API SERVICE
// =================================================================

// --- Authentication ---

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<void> => {
  console.log("Attempting to sign in with Google...");
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Google sign-in successful:", result);
    const user = result.user;
    console.log("User object:", user);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    // Log specific error properties if they exist
    if (error instanceof Error) {
        const firebaseError = error as any; // Cast to access potential Firebase-specific properties
        console.error("Firebase error code:", firebaseError.code);
        console.error("Firebase error message:", firebaseError.message);
        // The email of the user's account used.
        const email = firebaseError.customData?.email;
        console.error("Firebase custom email data:", email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(firebaseError);
        console.error("Firebase credential from error:", credential);
    }
    throw new Error("Failed to sign in with Google. Check the developer console for more details.");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out.");
  }
};

// --- Data Fetching ---

export const listenForData = (
  uid: string,
  callback: (data: IndexData, sources: SourceFile[]) => void
) => {
  const userDocRef = doc(db, 'users', uid);

  // onSnapshot returns an unsubscribe function
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const encyclopedia = data.encyclopedia as IndexData || { characters: [], plot_points: [], magic_items: [], monsters: [], battles: [], locations: [] };
      const sources = data.sources as SourceFile[] || [];
      callback(encyclopedia, sources);
    } else {
      // Document doesn't exist yet for a new user
      callback({ characters: [], plot_points: [], magic_items: [], monsters: [], battles: [], locations: [] }, []);
    }
  }, (error) => {
    console.error("Error listening to data:", error);
  });
};

// --- File Upload ---

export const uploadFiles = async (uid: string, files: FileList): Promise<void> => {
    const uploadPromises = Array.from(files).map(file => {
        const storageRef = ref(storage, `uploads/${uid}/${file.name}`);
        return uploadBytes(storageRef, file);
    });
    
    try {
        await Promise.all(uploadPromises);
    } catch(error) {
        console.error("Error uploading files:", error);
        throw new Error("One or more files failed to upload.");
    }
    // Uploads will automatically trigger the backend Cloud Function
};


// --- Data Reset ---

export const resetData = async (uid: string): Promise<void> => {
    try {
        const resetUserDataFunction = httpsCallable(functions, 'resetUserData');
        await resetUserDataFunction();
    } catch (error) {
        console.error("Error calling reset function:", error);
        throw new Error("Failed to reset user data on the server.");
    }
};