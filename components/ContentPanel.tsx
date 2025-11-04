import React, { useState, useMemo } from 'react';
import { Category, BaseEntity } from '../types';
import { CATEGORY_DETAILS } from '../constants';

interface ContentPanelProps {
  items: BaseEntity[];
  category: Category;
  onSelect: (item: BaseEntity) => void;
  selectedItem: BaseEntity | null;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ items = [], category, onSelect, selectedItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { label, nameKey } = CATEGORY_DETAILS[category];

  if (!Array.isArray(items)) {
    console.error(`ContentPanel received non-array items for category: ${category}`, items);
    return (
        <div className="w-full md:w-1/3 border-r-2 border-amber-900 bg-stone-950/30 flex flex-col overflow-hidden">
             <div className="p-4 text-center text-red-400">
                <p>An internal error occurred: data is not in the expected format.</p>
            </div>
        </div>
    );
  }

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item[nameKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, nameKey]);

  const selectedItemId = selectedItem ? selectedItem.id : null;

  return (
    <div className="w-full md:w-1/3 border-r-2 border-amber-900 bg-stone-950/30 flex flex-col overflow-hidden">
      <div className="p-4 border-b-2 border-amber-900 flex-shrink-0">
        <h2 className="text-2xl font-fancy text-amber-200 mb-2">{label}</h2>
        <input
          type="text"
          placeholder={`Search ${label}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-stone-800 border border-amber-800 rounded-md px-3 py-2 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <ul className="overflow-y-auto flex-grow">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className={`w-full text-left p-4 border-b border-amber-900/50 transition-colors duration-200 ${
                  item.id === selectedItemId
                    ? 'bg-amber-800/40'
                    : 'hover:bg-stone-800'
                }`}
              >
                {item[nameKey]}
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-stone-400">No entries found.</li>
        )}
      </ul>
    </div>
  );
};