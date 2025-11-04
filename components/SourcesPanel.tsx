import React from 'react';
import { SourceFile } from '../types';
import { SourcesIcon } from './icons/Icons';

interface SourcesPanelProps {
  sources: SourceFile[];
  onAddFiles: () => void;
}

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ sources, onAddFiles }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 md:p-8 overflow-y-auto bg-stone-950/50">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-fancy text-amber-200 mb-6 text-center">
          Source Library
        </h2>
        
        {sources.length > 0 ? (
          <ul className="bg-stone-900/50 border border-amber-900/50 rounded-lg shadow-lg">
            {sources.map((source, index) => (
              <li 
                key={source.id}
                className={`p-4 flex items-center space-x-4 ${index < sources.length - 1 ? 'border-b border-amber-900/50' : ''}`}
              >
                <SourcesIcon className="h-6 w-6 text-amber-400 flex-shrink-0" />
                <span className="text-amber-100">{source.name}</span>
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
