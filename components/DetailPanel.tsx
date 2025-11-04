import React from 'react';
import { Category, BaseEntity, Character, PlotPoint, MagicItem, Monster, Battle, Location, Link, Citation, SourceFile } from '../types';
import { CATEGORY_DETAILS } from '../constants';
import { FileUpload } from './FileUpload';
import { TimelineIcon } from './icons/Icons';

interface DetailPanelProps {
  item: BaseEntity | null;
  onLinkClick: (id: string) => void;
  isDataEmpty: boolean;
  isProcessing: boolean;
  onAddFiles: () => void;
  sources: SourceFile[];
  onViewOnTimeline: (item: BaseEntity) => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-fancy text-amber-300 border-b border-amber-800/50 pb-1 mb-2">{title}</h3>
        <div className="text-amber-100/90 whitespace-pre-wrap">{children}</div>
    </div>
);

const LinksSection: React.FC<{ links: Link[], onLinkClick: (id: string) => void }> = ({ links, onLinkClick }) => {
    if (!links || links.length === 0) return null;
    return (
        <div className="mb-6">
            <h3 className="text-lg font-fancy text-amber-300 border-b border-amber-800/50 pb-1 mb-2">Related Entries</h3>
            <div className="flex flex-wrap gap-2">
                {links.map(link => {
                    const categoryDetail = CATEGORY_DETAILS[link.category as Category];
                    const Icon = categoryDetail ? categoryDetail.icon : () => null;
                    return (
                        <button
                            key={link.id}
                            onClick={() => onLinkClick(link.id)}
                            className="bg-stone-800 hover:bg-stone-700 text-amber-200 text-sm px-3 py-1 rounded-full flex items-center transition-colors"
                        >
                           <Icon className="h-4 w-4 mr-2" />
                           {link.name}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

const CitationsSection: React.FC<{ citations: Citation[], sources: SourceFile[] }> = ({ citations, sources }) => {
    if (!citations || citations.length === 0) return null;

    const getSourceName = (sourceId: string) => {
        const source = sources.find(s => s.id === sourceId);
        return source ? source.name : "Unknown Source";
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-fancy text-amber-300 border-b border-amber-800/50 pb-1 mb-2">Citations</h3>
            <div className="space-y-4">
                {citations.map((citation, index) => (
                    <blockquote key={index} className="border-l-4 border-amber-700 pl-4 py-2 bg-stone-800/30 rounded-r-md">
                        <p className="text-amber-100/80 italic">"{citation.snippet}"</p>
                        <footer className="text-right text-xs text-stone-400 mt-2">&mdash; {getSourceName(citation.sourceId)}</footer>
                    </blockquote>
                ))}
            </div>
        </div>
    );
};


export const DetailPanel: React.FC<DetailPanelProps> = ({ item, onLinkClick, isDataEmpty, onAddFiles, isProcessing, sources, onViewOnTimeline }) => {
  if (!item) {
    if (isDataEmpty) {
        return (
            <div className="w-full md:w-2/3 flex items-center justify-center p-8">
                <div className="text-center max-w-2xl">
                    <h2 className="text-3xl font-fancy text-amber-200 mb-4">Welcome, Innkeeper!</h2>
                    <p className="mb-6 text-lg text-amber-100/80">
                    To build your encyclopedia, upload your book files. The AI will read them in the cloud and index everything for you.
                    </p>
                    <FileUpload onAddFiles={onAddFiles} disabled={isProcessing} />
                    <p className="mt-6 text-sm text-stone-400">
                    Your encyclopedia is saved to your account and is accessible from any device.
                    </p>
                </div>
            </div>
        );
    }

    return (
      <div className="w-full md:w-2/3 flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
            <h2 className="text-3xl font-fancy text-amber-200">Select an Entry</h2>
            <p className="text-stone-300 mt-2">Choose an item from the list to see its details here.</p>
            <img src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop" alt="An old open book" className="rounded-lg mt-6 opacity-40 mx-auto shadow-lg" />
        </div>
      </div>
    );
  }
  
  const findCategory = (item: BaseEntity): Category | null => {
      if ('first_appearance_context' in item) return Category.Characters;
      if ('chronological_order' in item) return Category.PlotPoints;
      if ('abilities' in item && 'description' in item) {
          return 'first_appearance_context' in item ? null : Category.MagicItems;
      }
      if ('significance' in item) return Category.Locations;
      if ('participants' in item) return Category.Battles;
      return null;
  }

  const renderDetails = () => {
    const category = findCategory(item);
    
    switch (category) {
      case Category.Characters:
        const char = item as Character;
        return <DetailSection title="First Appearance Context">{char.first_appearance_context}</DetailSection>;
      case Category.PlotPoints:
        return null;
      case Category.MagicItems:
      case Category.Monsters:
        const entity = item as MagicItem | Monster;
        return <DetailSection title="Abilities">{entity.abilities}</DetailSection>;
      case Category.Locations:
        const loc = item as Location;
        return <DetailSection title="Significance">{loc.significance}</DetailSection>;
      case Category.Battles:
        const battle = item as Battle;
        return (
          <>
            <DetailSection title="Participants">{battle.participants.join(', ')}</DetailSection>
            <DetailSection title="Outcome">{battle.outcome}</DetailSection>
          </>
        );
      default:
        if('abilities' in item) return <DetailSection title="Abilities">{(item as Monster).abilities}</DetailSection>;
        return null;
    }
  };

  const isTimelineable = item && findCategory(item) !== Category.PlotPoints;

  return (
    <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-stone-900">
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-4xl font-fancy text-amber-300">{item.name}</h2>
                {isTimelineable && (
                    <button 
                        onClick={() => onViewOnTimeline(item)}
                        className="flex items-center text-sm bg-stone-800 hover:bg-stone-700 text-amber-200 px-4 py-2 rounded-lg transition-colors ml-4 flex-shrink-0"
                    >
                        <TimelineIcon className="h-5 w-5 mr-2" />
                        View on Timeline
                    </button>
                )}
            </div>

            <DetailSection title="Description">{item.description}</DetailSection>
            {renderDetails()}
            <LinksSection links={item.links} onLinkClick={onLinkClick} />
            <CitationsSection citations={item.citations} sources={sources} />
            <p className="text-xs text-stone-500 italic mt-8 text-center">
                Image is for illustrative purposes only. Content generated by AI based on uploaded text.
            </p>
        </div>
    </div>
  );
};