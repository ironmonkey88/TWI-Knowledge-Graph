import React from 'react';
import { SourceFile } from '../types';
import { SourcesIcon, UploadIcon } from './icons/Icons';
import { ProgressBar } from './ProgressBar';

interface SourcesPanelProps {
  sources: SourceFile[];
  uploadingFiles: File[];
  onAddFiles: () => void;
  onReprocess: (sourceId: string) => void; // Add this prop
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, uploadingFiles, onAddFiles, onReprocess }) => {
  const hasFiles = sources.length > 0 || uploadingFiles.length > 0;

  // Simulate progress for demonstration
  const getSimulatedProgress = (source: SourceFile) => {
    if (source.status === 'completed') return 100;
    if (source.status === 'processing') return Math.floor(Math.random() * 80) + 10; // Random progress
    return 0;
  };

  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 overflow-y-auto bg-stone-950/50">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-fancy text-amber-200 text-center">
            Source Library
          </h2>
           <button
                onClick={onAddFiles}
                className="px-6 py-3 bg-amber-600 text-stone-900 font-bold rounded-lg shadow-md hover:bg-amber-500 transition-all duration-300 transform hover:scale-105"
            >
                Add Book Files
            </button>
        </div>
        
        {hasFiles ? (
          <ul className="bg-stone-900/50 border border-amber-900/50 rounded-lg shadow-lg">
            {sources.map((source, index) => (
              <li 
                key={source.id}
                className={`p-4 flex items-center space-x-4 border-b border-amber-900/50' : ''}`}
              >
                <SourcesIcon className="h-6 w-6 text-amber-400 flex-shrink-0" />
                <div className="flex-grow">
                  <span className="text-amber-100">{source.name}</span>
                  <ProgressBar progress={getSimulatedProgress(source)} status={source.status} />
                  <p className="text-xs text-stone-400">Status: {source.status}</p>
                </div>
                {source.status === 'failed' && (
                  <button 
                    onClick={() => onReprocess(source.id)}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors duration-300"
                  >
                    Reprocess
                  </button>
                )}
              </li>
            ))}
             {uploadingFiles.map((file, index) => (
              <li 
                key={file.name + index} // Use a more robust key if possible
                className={`p-4 flex items-center space-x-4 animate-pulse border-b border-amber-900/50' : ''}`}
              >
                <UploadIcon className="h-6 w-6 text-stone-400 flex-shrink-0" />
                <span className="text-stone-400 italic">{file.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-6 bg-stone-900/50 border-2 border-dashed border-amber-800/50 rounded-lg">
            <h3 className="text-2xl font-fancy text-amber-200">Your Library is Empty</h3>
            <p className="text-stone-300 mt-2 mb-6">
              Add your first book to begin building your encyclopedia.
            </p>
             <button
                onClick={onAddFiles}
                className="px-6 py-3 bg-amber-600 text-stone-900 font-bold rounded-lg shadow-md hover:bg-amber-500 transition-all duration-300 transform hover:scale-105"
            >
                Add Book Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
