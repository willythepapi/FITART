// Zzelix Type Definitions

export interface Game {
  id: string;
  title: string;
  description: string;
  synopsis: string;
  coverImage: string;
  bannerImage: string;
  developer: string;
  releaseDate: string;
  genre: GameGenre[];
  rating: ContentRating;
  episodeCount: number;
  totalPlaytime: string; // e.g., "8-12 hours"
  tags: string[];
  isFeatured: boolean;
  isOriginal: boolean; // Zzelix Original
  trailerUrl?: string;
}

export interface UserProgress {
  gameId: string;
  currentEpisode: number;
  progressPercent: number;
  lastPlayedAt: Date;
  totalPlaytime: number; // in minutes
  saveSlots: SaveSlot[];
}

export interface SaveSlot {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  episodeNumber: number;
  sceneId: string;
  thumbnail?: string;
  choices: GameChoice[];
}

export interface GameChoice {
  sceneId: string;
  choiceId: string;
  choiceText: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  subscription: SubscriptionTier;
  isAgeVerified: boolean;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'tr' | 'en';
  autoSave: boolean;
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  volume: {
    master: number;
    music: number;
    sfx: number;
    voice: number;
  };
  subtitles: boolean;
}

export type SubscriptionTier = 'free' | 'premium';

export type ContentRating = 'everyone' | 'teen' | 'mature';

export type GameGenre =
  | 'romance'
  | 'mystery'
  | 'sci-fi'
  | 'fantasy'
  | 'horror'
  | 'drama'
  | 'comedy'
  | 'action'
  | 'slice-of-life';

export interface Category {
  id: string;
  title: string;
  slug: string;
  games: Game[];
}

// Visual Novel Scene Types
export interface VNScene {
  id: string;
  background: string;
  characters: VNCharacter[];
  dialogue: VNDialogue[];
  choices?: VNChoice[];
  nextSceneId?: string;
}

export interface VNCharacter {
  id: string;
  name: string;
  sprite: string;
  position: 'left' | 'center' | 'right';
  expression: string;
}

export interface VNDialogue {
  characterId?: string; // null for narrator
  text: string;
  voiceover?: string;
}

export interface VNChoice {
  id: string;
  text: string;
  nextSceneId: string;
  consequence?: string; // for tracking story branches
}
