export interface Link {
  id: string;
  name: string;
  category: Category;
}

export interface Citation {
  sourceId: string;
  snippet: string;
}

export interface BaseEntity {
  id: string;
  name: string;
  description: string;
  links: Link[];
  citations: Citation[];
}

export interface Character extends BaseEntity {
  first_appearance_context: string;
}

export interface PlotPoint extends BaseEntity {
  chronological_order: number;
}

export interface MagicItem extends BaseEntity {
  abilities: string;
}

export interface Monster extends BaseEntity {
  abilities: string;
}

export interface Location extends BaseEntity {
    significance: string;
}

export interface Battle extends BaseEntity {
  participants: string[];
  outcome: string;
}

export interface IndexData {
  characters: Character[];
  plot_points: PlotPoint[];
  magic_items: MagicItem[];
  monsters: Monster[];
  battles: Battle[];
  locations: Location[];
}

export interface SourceFile {
    id: string;
    name: string;
    type: string;
}

export enum Category {
  Characters = 'characters',
  PlotPoints = 'plot_points',
  MagicItems = 'magic_items',
  Monsters = 'monsters',
  Battles = 'battles',
  Locations = 'locations',
}