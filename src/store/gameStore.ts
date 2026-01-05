import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Game, SaveSlot, UserProgress } from '@/types';

interface GameState {
    // Current game session
    currentGame: Game | null;
    currentEpisode: number;
    currentSceneId: string | null;
    isPlaying: boolean;

    // Progress tracking
    userProgress: Map<string, UserProgress>;

    // UI state
    showSaveMenu: boolean;
    showSettingsMenu: boolean;

    // Actions
    loadGame: (game: Game, progress?: UserProgress) => void;
    startNewGame: (game: Game) => void;
    exitGame: () => void;

    advanceScene: (sceneId: string) => void;
    advanceEpisode: (episode: number) => void;

    saveGame: (slotName: string) => SaveSlot;
    loadSave: (slot: SaveSlot) => void;

    updateProgress: (gameId: string, progress: Partial<UserProgress>) => void;

    toggleSaveMenu: () => void;
    toggleSettingsMenu: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Initial state
            currentGame: null,
            currentEpisode: 1,
            currentSceneId: null,
            isPlaying: false,
            userProgress: new Map(),
            showSaveMenu: false,
            showSettingsMenu: false,

            // Load existing game with progress
            loadGame: (game, progress) =>
                set({
                    currentGame: game,
                    currentEpisode: progress?.currentEpisode || 1,
                    currentSceneId: progress?.saveSlots?.[0]?.sceneId || null,
                    isPlaying: true,
                }),

            // Start fresh playthrough
            startNewGame: (game) =>
                set({
                    currentGame: game,
                    currentEpisode: 1,
                    currentSceneId: 'scene_001',
                    isPlaying: true,
                }),

            // Exit current game
            exitGame: () =>
                set({
                    currentGame: null,
                    currentEpisode: 1,
                    currentSceneId: null,
                    isPlaying: false,
                    showSaveMenu: false,
                    showSettingsMenu: false,
                }),

            // Advance to a new scene
            advanceScene: (sceneId) => set({ currentSceneId: sceneId }),

            // Advance to a new episode
            advanceEpisode: (episode) => set({ currentEpisode: episode }),

            // Save current game state
            saveGame: (slotName) => {
                const state = get();
                const saveSlot: SaveSlot = {
                    id: `save_${Date.now()}`,
                    name: slotName,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    episodeNumber: state.currentEpisode,
                    sceneId: state.currentSceneId || 'scene_001',
                    choices: [],
                };

                // Update progress for current game
                if (state.currentGame) {
                    const gameId = state.currentGame.id;
                    const existingProgress = state.userProgress.get(gameId);
                    const newProgress: UserProgress = {
                        gameId,
                        currentEpisode: state.currentEpisode,
                        progressPercent: Math.round((state.currentEpisode / state.currentGame.episodeCount) * 100),
                        lastPlayedAt: new Date(),
                        totalPlaytime: (existingProgress?.totalPlaytime || 0) + 1,
                        saveSlots: [...(existingProgress?.saveSlots || []), saveSlot],
                    };
                    state.userProgress.set(gameId, newProgress);
                    set({ userProgress: new Map(state.userProgress) });
                }

                return saveSlot;
            },

            // Load a save slot
            loadSave: (slot) =>
                set({
                    currentEpisode: slot.episodeNumber,
                    currentSceneId: slot.sceneId,
                    isPlaying: true,
                }),

            // Update progress for a specific game
            updateProgress: (gameId, progress) => {
                const state = get();
                const existing = state.userProgress.get(gameId);
                if (existing) {
                    state.userProgress.set(gameId, { ...existing, ...progress });
                    set({ userProgress: new Map(state.userProgress) });
                }
            },

            // Toggle menus
            toggleSaveMenu: () =>
                set((state) => ({ showSaveMenu: !state.showSaveMenu })),
            toggleSettingsMenu: () =>
                set((state) => ({ showSettingsMenu: !state.showSettingsMenu })),
        }),
        {
            name: 'zzelix-game-store',
            partialize: (state) => ({
                userProgress: Array.from(state.userProgress.entries()),
            }),
        }
    )
);
