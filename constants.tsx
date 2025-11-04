import React from 'react';
import { Category } from './types';
import { CharacterIcon, PlotIcon, ItemIcon, MonsterIcon, BattleIcon, LocationIcon, SourcesIcon } from './components/icons/Icons';

interface CategoryDetail {
  label: string;
  icon: React.FC<{ className?: string }>;
  nameKey: 'name';
}

export const CATEGORY_DETAILS: Record<Category, CategoryDetail> = {
  [Category.Characters]: { label: 'Characters', icon: CharacterIcon, nameKey: 'name' },
  [Category.PlotPoints]: { label: 'Plot Points', icon: PlotIcon, nameKey: 'name' },
  [Category.MagicItems]: { label: 'Magic Items', icon: ItemIcon, nameKey: 'name' },
  [Category.Locations]: { label: 'Locations', icon: LocationIcon, nameKey: 'name' },
  [Category.Monsters]: { label: 'Monsters', icon: MonsterIcon, nameKey: 'name' },
  [Category.Battles]: { label: 'Battles', icon: BattleIcon, nameKey: 'name' },
};

export const SOURCES_DETAILS = {
  label: 'Sources',
  icon: SourcesIcon,
};
