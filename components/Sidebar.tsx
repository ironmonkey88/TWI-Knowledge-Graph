import React from 'react';
import { Category } from '../types';
import { CATEGORY_DETAILS, SOURCES_DETAILS } from '../constants';

interface SidebarProps {
  selectedItem: Category | 'sources';
  onSelect: (item: Category | 'sources') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onSelect }) => {
  return (
    <nav className="bg-stone-950/50 p-2 md:p-4 md:w-64 flex-shrink-0 flex md:flex-col items-center md:items-stretch">
        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 w-full justify-around">
        <h2 className="hidden md:block text-xl font-fancy text-center text-amber-200 mb-2 border-b border-amber-800 pb-2">Index</h2>
        {Object.entries(CATEGORY_DETAILS).map(([key, { label, icon: Icon }]) => (
            <button
            key={key}
            onClick={() => onSelect(key as Category)}
            className={`flex items-center justify-center md:justify-start p-3 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                selectedItem === key
                ? 'bg-amber-800/50 text-amber-100 shadow-inner'
                : 'text-amber-200 hover:bg-stone-800'
            }`}
            >
            <Icon className="h-5 w-5 md:mr-3 flex-shrink-0" />
            <span className="hidden md:inline">{label}</span>
            </button>
        ))}
        <div className="hidden md:block h-px my-2 bg-amber-900/50"></div>
         <button
            onClick={() => onSelect('sources')}
            className={`flex items-center justify-center md:justify-start p-3 rounded-lg transition-colors duration-200 text-sm md:text-base ${
                selectedItem === 'sources'
                ? 'bg-amber-800/50 text-amber-100 shadow-inner'
                : 'text-amber-200 hover:bg-stone-800'
            }`}
            >
            <SOURCES_DETAILS.icon className="h-5 w-5 md:mr-3 flex-shrink-0" />
            <span className="hidden md:inline">{SOURCES_DETAILS.label}</span>
        </button>
        </div>
    </nav>
  );
};
