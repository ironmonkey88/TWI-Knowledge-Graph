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
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw new Error("Failed to sign in with Google.");
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