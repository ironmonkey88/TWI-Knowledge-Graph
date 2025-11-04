import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentPanel } from './components/ContentPanel';
import { DetailPanel } from './components/DetailPanel';
import { Loader } from './components/Loader';
import * as dbService from './services/dbService';
import * as geminiService from './services/geminiService';
import { IndexData, Category, BaseEntity, SourceFile } from './types';
import { Timeline } from './components/Timeline';
import { SourcesPanel } from './components/SourcesPanel';
import { CharacterIcon, TimelineIcon, ResetIcon, AddIcon } from './components/icons/Icons';

type AppState = 'initializing' | 'processing' | 'error' | 'ready';
type View = 'encyclopedia' | 'timeline' | 'sources';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initializing');
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [sources, setSources] = useState<SourceFile[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Characters);
  const [selectedItem, setSelectedItem] = useState<BaseEntity | null>(null);
  const [view, setView] = useState<View>('encyclopedia');
  const [timelineFilters, setTimelineFilters] = useState<BaseEntity[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
        setAppState('initializing');
        setLoadingMessage('Loading encyclopedia from your browser...');
        await dbService.initDB();
        const [data, sourceFiles] = await Promise.all([
            dbService.loadEncyclopedia(),
            dbService.loadSources()
        ]);
        if (data) setIndexData(data);
        if (sourceFiles) setSources(sourceFiles);
    } catch (err) {
        console.error("Failed to load data from DB", err);
        setError("Could not load your encyclopedia from the browser's database.");
        setAppState('error');
    } finally {
        setAppState('ready');
        setLoadingMessage('');
    }
  };

  useEffect(() => {
    loadData();
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

  const handleProcessFiles = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;

    setAppState('processing');
    setError(null);
    setSelectedItem(null);

    try {
      const { updatedData, updatedSources } = await geminiService.processFiles(
        files,
        indexData,
        (message: string) => setLoadingMessage(message)
      );
      
      setIndexData(updatedData);
      setSources(updatedSources);
      setAppState('ready');

    } catch (err) {
      console.error("Caught error in App component:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unknown error occurred during file processing.';
      setError(errorMessage);
      setAppState('error');
    } finally {
        setLoadingMessage('');
    }
  }, [indexData]);

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
    const confirmed = window.confirm("Are you sure you want to start over? This will permanently delete your entire encyclopedia and all source files from this browser.");
    if (confirmed) {
        try {
            setAppState('processing');
            setLoadingMessage('Deleting all data from your browser...');
            await dbService.clearAllData();
            setIndexData(null);
            setSources([]);
            setError(null);
            setSelectedItem(null);
            setView('encyclopedia');
            setSelectedCategory(Category.Characters);
            setTimelineFilters([]);
            setAppState('ready');
        } catch (err) {
            console.error("Failed to clear data:", err);
            setError("Could not clear the browser database. Please try again.");
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

  const renderMainContent = () => {
    if (appState === 'error') {
      return (
        <div className="w-full flex flex-col items-center justify-center p-8 text-red-400">
           <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
            <p>{error}</p>
             <button
                onClick={loadData} // Allow user to try reloading data
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
        return <SourcesPanel sources={sources} onAddFiles={handleAddFilesClick} />;
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
            isProcessing={appState === 'processing'}
            sources={sources}
            onViewOnTimeline={handleViewOnTimeline}
        />
      </>
    );
  }

  if (appState === 'initializing' || appState === 'processing') {
    return (
        <div className="w-screen h-screen flex items-center justify-center p-8">
            <Loader message={loadingMessage || "Please wait..."} />
        </div>
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
        disabled={appState === 'processing'}
      />
      <header className="text-center p-4 border-b-2 border-amber-800 shadow-lg shadow-amber-900/50 relative flex items-center justify-between">
         {/* Header is now simplified as loading is a full-screen overlay */}
        <div className="flex-1"></div>
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
                    disabled={appState === 'processing'}
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