import React, { useMemo, useState, useEffect } from 'react';
import { BaseEntity, IndexData, PlotPoint, Category } from '../types';
import { CATEGORY_DETAILS } from '../constants';
import { CloseIcon } from './icons/Icons';

interface TimelineProps {
    indexData: IndexData | null;
    filters: BaseEntity[];
    setFilters: React.Dispatch<React.SetStateAction<BaseEntity[]>>;
}

const TimelineFilter: React.FC<TimelineProps> = ({ indexData, filters, setFilters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const allEntities = useMemo(() => {
        if (!indexData) return [];
        return (Object.keys(indexData) as Category[])
            .filter(key => key !== 'plot_points') // Don't filter by plot points
            .flatMap(category => indexData[category].map(item => ({...item, category })))
    }, [indexData]);

    const suggestions = useMemo(() => {
        if (!searchTerm) return [];
        const lowerCaseSearch = searchTerm.toLowerCase();
        return allEntities
            .filter(entity => entity.name.toLowerCase().includes(lowerCaseSearch))
            .filter(entity => !filters.some(f => f.id === entity.id)) // Don't suggest already added filters
            .slice(0, 5); // Limit suggestions
    }, [searchTerm, allEntities, filters]);

    const addFilter = (entity: BaseEntity) => {
        setFilters(prev => [...prev, entity]);
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const removeFilter = (entity: BaseEntity) => {
        setFilters(prev => prev.filter(f => f.id !== entity.id));
    };

    return (
        <div className="p-4 bg-stone-900/50 border-b-2 border-amber-800 w-full flex-shrink-0">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-amber-200">Filters:</span>
                    {filters.length === 0 && <span className="text-sm text-stone-400">None</span>}
                    {filters.map(filter => (
                        <div key={filter.id} className="bg-amber-700 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
                            <span>{filter.name}</span>
                            <button onClick={() => removeFilter(filter)} className="text-amber-200 hover:text-white">
                                <CloseIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter by character, location, etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                        className="w-full bg-stone-800 border border-amber-800 rounded-md px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-20 w-full bg-stone-800 border border-amber-700 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map(entity => {
                                const category = (entity as any).category;
                                const Icon = CATEGORY_DETAILS[category]?.icon;
                                return (
                                    <li key={entity.id}>
                                        <button 
                                            onClick={() => addFilter(entity)}
                                            className="w-full text-left px-4 py-2 hover:bg-stone-700 text-amber-100 flex items-center gap-2"
                                        >
                                            {Icon && <Icon className="h-4 w-4 text-amber-400" />}
                                            {entity.name} 
                                            <span className="text-xs text-stone-400">({CATEGORY_DETAILS[category]?.label})</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Timeline: React.FC<TimelineProps> = ({ indexData, filters, setFilters }) => {
    const plotPoints = indexData?.plot_points ?? [];

    const filteredPoints = useMemo(() => {
        if (!plotPoints) return [];
        let sorted = [...plotPoints].sort((a, b) => a.chronological_order - b.chronological_order);
        
        if (filters.length === 0) {
            return sorted;
        }

        const filterIds = new Set(filters.map(f => f.id));
        return sorted.filter(point => {
            const pointLinkIds = new Set(point.links.map(l => l.id));
            return Array.from(filterIds).every(id => pointLinkIds.has(id));
        });
    }, [plotPoints, filters]);

    if (!indexData) {
         return <div className="w-full h-full flex items-center justify-center"><p>Loading timeline...</p></div>;
    }

    return (
        <div className="w-full h-full flex flex-col bg-stone-950/50">
            <TimelineFilter indexData={indexData} filters={filters} setFilters={setFilters} />
            
            {filteredPoints.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-center p-8">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-fancy text-amber-200">No Events Found</h2>
                        <p className="text-stone-300 mt-2">
                            {filters.length > 0 
                                ? "No events match the current filter combination."
                                : "No plot points were found in the uploaded file(s)."
                            }
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-grow overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#a16207 #333' }}>
                    <div className="relative inline-flex items-center px-8 h-full" style={{ minWidth: `${filteredPoints.length * 320}px`}}>
                        {/* Central Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-amber-700 -translate-y-1/2"></div>
                        
                        {filteredPoints.map((point, index) => (
                            <div key={point.id} className="relative flex flex-col justify-center h-full px-4" style={{ width: '320px' }}>
                                {/* Point on the line */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-amber-500 rounded-full border-2 border-stone-900 z-10"></div>
                                {/* Vertical Connector */}
                                <div className={`absolute left-1/2 -translate-x-1/2 w-0.5 h-1/2 bg-amber-700 ${index % 2 === 0 ? 'bottom-1/2' : 'top-1/2'}`}></div>
                                
                                {/* Content Box */}
                                <div className={`w-full bg-stone-800/50 border border-amber-800 rounded-lg p-4 shadow-lg text-left h-56 flex flex-col ${index % 2 === 0 ? 'mb-auto' : 'mt-auto'}`}>
                                    <h3 className="font-fancy text-lg text-amber-300 mb-2 flex-shrink-0">{point.name}</h3>
                                    <div className="overflow-y-auto flex-grow pr-2 text-sm text-amber-100/80 leading-relaxed">
                                        <p>{point.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};