import { IndexData, SourceFile } from '../types';

// =================================================================
// REAL, CLIENT-SIDE INDEXEDDB SERVICE
// =================================================================

const DB_NAME = 'WanderingInnCompanionDB';
const DB_VERSION = 2;
const ENCYCLOPEDIA_STORE = 'encyclopedia';
const SOURCES_STORE = 'sources';

let db: IDBDatabase;

export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve();

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject('Error opening database.');
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };
    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(ENCYCLOPEDIA_STORE)) {
        dbInstance.createObjectStore(ENCYCLOPEDIA_STORE, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(SOURCES_STORE)) {
        dbInstance.createObjectStore(SOURCES_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const saveEncyclopedia = (data: IndexData): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(ENCYCLOPEDIA_STORE, 'readwrite');
      const store = transaction.objectStore(ENCYCLOPEDIA_STORE);
      // We use a single key for the entire data object
      const request = store.put({ id: 'main', ...data });
      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to save encyclopedia.');
    });
};

export const loadEncyclopedia = (): Promise<IndexData | null> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(ENCYCLOPEDIA_STORE, 'readonly');
        const store = transaction.objectStore(ENCYCLOPEDIA_STORE);
        const request = store.get('main');
        request.onsuccess = () => {
            if (request.result) {
                const { id, ...data } = request.result;
                resolve(data as IndexData);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject('Failed to load encyclopedia.');
    });
};

export const saveSources = (sources: SourceFile[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(SOURCES_STORE, 'readwrite');
        const store = transaction.objectStore(SOURCES_STORE);
        let completed = 0;
        if (sources.length === 0) {
            resolve();
            return;
        }
        sources.forEach(source => {
            const request = store.put(source);
            request.onsuccess = () => {
                completed++;
                if (completed === sources.length) {
                    resolve();
                }
            };
        });
        transaction.onerror = () => reject('Failed to save sources.');
    });
};

export const loadSources = (): Promise<SourceFile[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(SOURCES_STORE, 'readonly');
        const store = transaction.objectStore(SOURCES_STORE);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject('Failed to load sources.');
    });
};

export const clearAllData = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([ENCYCLOPEDIA_STORE, SOURCES_STORE], 'readwrite');
        const encyclopediaStore = transaction.objectStore(ENCYCLOPEDIA_STORE);
        const sourcesStore = transaction.objectStore(SOURCES_STORE);
        
        encyclopediaStore.clear();
        sourcesStore.clear();

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject('Failed to clear all data.');
    });
};
