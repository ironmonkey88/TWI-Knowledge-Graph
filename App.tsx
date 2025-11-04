
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentPanel } from './components/ContentPanel';
import { DetailPanel } from './components/DetailPanel';
import { Loader } from './components/Loader';
import * as apiService from './services/apiService';
import { IndexData, Category, BaseEntity, SourceFile, User, SourceFileStatus } from './types';
import { Timeline } from './components/Timeline';
import { SourcesPanel } from './components/SourcesPanel';
import { CharacterIcon, TimelineIcon, ResetIcon, AddIcon } from './components/icons/Icons';
import { LoginScreen } from './components/LoginScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseService';

type AppState = 'initializing' | 'processing' | 'error' | 'ready';
type View = 'encyclopedia' | 'timeline' | 'sources';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initializing');
  const [user, setUser] = useState<User | null>(null);
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Characters);
  const [selectedItem, setSelectedItem] = useState<BaseEntity | null>(null);
  const [view, setView] = useState<View>('encyclopedia');
  const [timelineFilters, setTimelineFilters] = useState<BaseEntity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadingMessage("Authenticating...");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const currentUser = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(currentUser);
        setLoadingMessage("Loading your encyclopedia from the cloud...");
        try {
          // Listen for realtime updates
          apiService.listenForData(currentUser.uid, (data, sourceFiles) => {
            setIndexData(data);
            setSources(sourceFiles);
            setAppState('ready');
            setLoadingMessage('');
          });
        } catch(err) {
            console.error("Failed to load data from Firebase", err);
            setError("Could not load your encyclopedia from the cloud.");
            setAppState('error');
        }
      } else {
        setUser(null);
        setIndexData(null);
        setSources([]);
        setAppState('ready');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
          handleProcessFiles(event.target.files);
      }
      if (event.target) {
          event.target.value = "";
      }
  };

  const handleAddFilesClick = () => {
      fileInputRef.current?.click();
  };

  const handleProcessFiles = useCallback((files: FileList) => {
    if (!files || files.length === 0 || !user) return;

    const newFiles = Array.from(files);
    setUploadingFiles(prev => [...prev, ...newFiles]);
    setError(null);
    setSelectedItem(null);

    // Don't await this call, let it run in the background
    apiService.uploadFiles(user.uid, files)
      .then(() => {
        // Handle successful upload if needed, e.g., show a notification
        console.log('All files uploaded successfully');
      })
      .catch(err => {
        console.error("Caught error in App component during file upload:", err);
        const errorMessage = err instanceof Error
          ? err.message
          : 'An unknown error occurred during file upload.';
        setError(errorMessage);
        setAppState('error'); // Or handle error in a less disruptive way
      })
      .finally(() => {
        // Remove these specific files from the uploading list
        setUploadingFiles(prev => prev.filter(f => !newFiles.includes(f)));
      });

  }, [user]);

  const handleReprocess = (sourceId: string) => {
    // This is a placeholder for the actual reprocessing logic.
    // In a real app, this would trigger a backend function.
    console.log(`Reprocessing source ${sourceId}`);
    setSources(prev => prev.map(s => s.id === sourceId ? { ...s, status: 'processing' } : s));
  };


  const handleCategorySelect = (category: Category | 'sources') => {
    if (category === 'sources') {
        setView('sources');
        setSelectedItem(null);
    } else {
        setView('encyclopedia');
        setSelectedCategory(category);
        setSelectedItem(null);
    }
  };
  
  const handleItemSelect = (item: BaseEntity) => {
    setSelectedItem(item);
  };

  const handleLinkClick = (id: string) => {
    if (!indexData) return;
    for (const category of Object.keys(indexData) as Category[]) {
        const items = indexData[category];
        if (Array.isArray(items)) {
            const foundItem = items.find(item => item.id === id);
            if (foundItem) {
                setView('encyclopedia');
                setSelectedCategory(category);
                setSelectedItem(foundItem);
                return;
            }
        }
    }
    console.warn(`Could not find item with id: ${id}`);
  };

  const handleResetApp = async () => {
    if (!user) return;
    const confirmed = window.confirm("Are you sure you want to start over? This will permanently delete your entire encyclopedia and all source files from your account.");
    if (confirmed) {
        try {
            setAppState('processing');
            setLoadingMessage('Deleting all data from your account...');
            await apiService.resetData(user.uid);
            // Listener will update state to empty
            setAppState('ready');
        } catch (err) {
            console.error("Failed to clear data:", err);
            setError("Could not clear your account data. Please try again.");
            setAppState('error');
        } finally {
            setLoadingMessage('');
        }
    }
  };

  const handleViewOnTimeline = (item: BaseEntity) => {
    setTimelineFilters([item]);
    setView('timeline');
  };

  const isDataEmpty = useMemo(() => {
    if (!indexData) return true;
    return Object.values(indexData).every(arr => Array.isArray(arr) && arr.length === 0);
  }, [indexData]);
  
  useEffect(() => {
    // Simulate file processing for any file with 'processing' status
    const processingSources = sources.filter(s => s.status === 'processing');
    if (processingSources.length === 0) return;

    const timer = setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.status === 'processing' ? { ...s, status: 'completed', progress: 100 } : s
      ));
    }, 3000); // Simulate a 3-second processing time

    return () => clearTimeout(timer);
  }, [sources]);

  if (appState === 'initializing' || appState === 'processing') {
    return (
        <div className="w-screen h-screen flex items-center justify-center p-8">
            <Loader message={loadingMessage || "Please wait..."} />
        </div>
    );
  }

  if (!user) {
    return <LoginScreen onLoginAttempt={apiService.loginWithGoogle} />;
  }
  
  const isProcessing = uploadingFiles.length > 0;

  const renderMainContent = () => {
    if (appState === 'error') {
      return (
        <div className="w-full flex flex-col items-center justify-center p-8 text-red-400">
           <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p>{error}</p>
             <button
                onClick={() => window.location.reload()} // Simple reload to retry
                className="mt-4 px-6 py-2 bg-amber-600 text-stone-900 font-bold rounded-lg shadow-md hover:bg-amber-500"
            >
                Try Again
            </button>
          </div>
        </div>
      );
    }

    if (view === 'timeline') {
      return (
        <Timeline 
            indexData={indexData} 
            filters={timelineFilters}
            setFilters={setTimelineFilters}
        />
      );
    }

    if (view === 'sources') {
        return <SourcesPanel sources={sources} uploadingFiles={uploadingFiles} onAddFiles={handleAddFilesClick} onReprocess={handleReprocess} />;
    }

    // Encyclopedia View
    return (
      <>
        <ContentPanel
          items={indexData ? indexData[selectedCategory] : []}
          category={selectedCategory}
          onSelect={handleItemSelect}
          selectedItem={selectedItem}
        />
        <DetailPanel
            item={selectedItem} 
            onLinkClick={handleLinkClick} 
            isDataEmpty={isDataEmpty}
            onAddFiles={handleAddFilesClick}
            isProcessing={isProcessing}
            sources={sources}
            onViewOnTimeline={handleViewOnTimeline}
        />
      </>
    );
  }


  return (
    <div className="min-h-screen bg-stone-900 text-amber-100 flex flex-col">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept=".txt,.epub"
        className="hidden"
        disabled={isProcessing}
      />
      <header className="text-center p-4 border-b-2 border-amber-800 shadow-lg shadow-amber-900/50 relative flex items-center justify-between">
         <div className="flex-1 flex justify-start">
            <div className="flex items-center space-x-2">
                <img src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} className="h-10 w-10 rounded-full border-2 border-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-amber-100">{user.displayName}</p>
                   <button onClick={apiService.logout} className="text-xs text-stone-400 hover:text-amber-300">Sign out</button>
                </div>
            </div>
         </div>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-fancy text-amber-300">The Wandering Inn Companion</h1>
          <p className="text-amber-200 text-sm">AI-Powered Encyclopedia</p>
        </div>
        <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-2 bg-stone-800/50 p-1 rounded-lg border border-amber-800/50">
                <button
                    onClick={handleAddFilesClick}
                    className="p-2 rounded-md text-sm transition-colors text-amber-200 hover:bg-stone-700 disabled:opacity-50"
                    aria-label="Add More Files"
                    title="Add More Files"
                    disabled={isProcessing}
                >
                    <AddIcon className="h-5 w-5" />
                </button>
                 <div className="w-px h-6 bg-amber-800/50"></div>
                <button
                    onClick={handleResetApp}
                    className="p-2 rounded-md text-sm transition-colors text-amber-200 hover:bg-stone-700"
                    aria-label="Start Over"
                    title="Start Over"
                >
                    <ResetIcon className="h-5 w-5" />
                </button>
                <div className="w-px h-6 bg-amber-800/50"></div>
                <button
                    onClick={() => setView('encyclopedia')}
                    className={`p-2 rounded-md text-sm transition-colors ${view === 'encyclopedia' ? 'bg-amber-700 text-white' : 'text-amber-200 hover:bg-stone-700'}`}
                    aria-label="Encyclopedia View"
                    title="Encyclopedia View"
                >
                    <CharacterIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => { setView('timeline'); setTimelineFilters([]); }}
                    className={`p-2 rounded-md text-sm transition-colors ${view === 'timeline' ? 'bg-amber-700 text-white' : 'text-amber-200 hover:bg-stone-700'}`}
                    aria-label="Timeline View"
                    title="Timeline View"
                >
                    <TimelineIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <Sidebar 
            selectedItem={view === 'sources' ? 'sources' : selectedCategory} 
            onSelect={handleCategorySelect} 
        />
        <div className="flex-grow flex flex-col md:flex-row w-full overflow-hidden">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

