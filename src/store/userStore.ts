import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences } from '@/types';

interface UserState {
    // User data
    user: User | null;
    isAuthenticated: boolean;
    isAgeVerified: boolean;

    // Actions
    setUser: (user: User | null) => void;
    login: (user: User) => void;
    logout: () => void;
    verifyAge: () => void;
    updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences: UserPreferences = {
    language: 'en',
    autoSave: true,
    textSpeed: 'normal',
    volume: {
        master: 80,
        music: 70,
        sfx: 80,
        voice: 100,
    },
    subtitles: true,
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAgeVerified: false,

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            login: (user) => set({ user, isAuthenticated: true }),

            logout: () => set({ user: null, isAuthenticated: false }),

            verifyAge: () => set({ isAgeVerified: true }),

            updatePreferences: (newPrefs) =>
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            preferences: { ...state.user.preferences, ...newPrefs },
                        }
                        : null,
                })),
        }),
        {
            name: 'zzelix-user-store',
            partialize: (state) => ({
                isAgeVerified: state.isAgeVerified,
                user: state.user,
            }),
        }
    )
);
