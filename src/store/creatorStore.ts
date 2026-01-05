import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreatorStory, StoryChapter, SceneBlueprint, NewStoryForm } from '@/types/creatorTypes';
import { mockGames } from '@/data/mockGames';
import { mapGameToCreatorStory } from '@/utils/dataMapper';

interface CreatorState {
    // ... (interfaces remain same)
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize with mapped data
const initialStories = mockGames.map(mapGameToCreatorStory);

export const useCreatorStore = create<CreatorState>()(
    persist(
        (set, get) => ({
            stories: initialStories,
            currentStory: null,
            // ... (rest remains same)

            createStory: (form: NewStoryForm) => {
                const id = generateId();
                const newStory: CreatorStory = {
                    id,
                    ...form,
                    posters: {
                        thumbnail: '/images/placeholders/cover.jpg', // Default placeholders
                        banner: '/images/placeholders/banner.jpg',
                        portrait: '/images/placeholders/portrait.jpg',
                    },
                    chapters: [],
                    status: 'draft',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    creatorId: 'creator_1',
                };

                set((state) => ({
                    stories: [...state.stories, newStory],
                }));

                return id;
            },

            updateStory: (storyId, updates) => {
                set((state) => ({
                    stories: state.stories.map((s) =>
                        s.id === storyId ? { ...s, ...updates, updatedAt: new Date() } : s
                    ),
                    currentStory: state.currentStory?.id === storyId
                        ? { ...state.currentStory, ...updates, updatedAt: new Date() }
                        : state.currentStory,
                    hasUnsavedChanges: true,
                }));
            },

            deleteStory: (storyId) => {
                set((state) => ({
                    stories: state.stories.filter((s) => s.id !== storyId),
                    currentStory: state.currentStory?.id === storyId ? null : state.currentStory,
                }));
            },

            setCurrentStory: (storyId) => {
                const story = storyId ? get().stories.find((s) => s.id === storyId) || null : null;
                set({
                    currentStory: story,
                    currentChapterId: story?.chapters[0]?.id || null,
                    currentSceneId: story?.chapters[0]?.scenes[0]?.id || null,
                });
            },

            setCurrentChapter: (chapterId) => {
                const story = get().currentStory;
                const chapter = story?.chapters.find((c) => c.id === chapterId);
                set({
                    currentChapterId: chapterId,
                    currentSceneId: chapter?.scenes[0]?.id || null,
                });
            },

            setCurrentScene: (sceneId) => {
                set({ currentSceneId: sceneId });
            },

            addChapter: (title) => {
                const story = get().currentStory;
                if (!story) return;

                const newChapter: StoryChapter = {
                    id: generateId(),
                    title,
                    order: story.chapters.length + 1,
                    scenes: [],
                };

                get().updateStory(story.id, {
                    chapters: [...story.chapters, newChapter],
                });
            },

            updateChapter: (chapterId, updates) => {
                const story = get().currentStory;
                if (!story) return;

                get().updateStory(story.id, {
                    chapters: story.chapters.map((c) =>
                        c.id === chapterId ? { ...c, ...updates } : c
                    ),
                });
            },

            deleteChapter: (chapterId) => {
                const story = get().currentStory;
                if (!story) return;

                get().updateStory(story.id, {
                    chapters: story.chapters.filter((c) => c.id !== chapterId),
                });
            },

            reorderChapters: (chapterIds) => {
                const story = get().currentStory;
                if (!story) return;

                const reordered = chapterIds.map((id, index) => {
                    const chapter = story.chapters.find((c) => c.id === id);
                    return chapter ? { ...chapter, order: index + 1 } : null;
                }).filter(Boolean) as StoryChapter[];

                get().updateStory(story.id, { chapters: reordered });
            },

            addScene: (chapterId) => {
                const story = get().currentStory;
                if (!story) return;

                const chapter = story.chapters.find((c) => c.id === chapterId);
                if (!chapter) return;

                const newScene: SceneBlueprint = {
                    id: generateId(),
                    order: chapter.scenes.length + 1,
                    backgroundImage: '',
                    audio: {
                        voiceover: '',
                        backgroundMusic: '',
                        backgroundVolume: 30,
                    },
                    dialog: {
                        text: '',
                        speaker: '',
                    },
                };

                get().updateChapter(chapterId, {
                    scenes: [...chapter.scenes, newScene],
                });

                set({ currentSceneId: newScene.id });
            },

            updateScene: (chapterId, sceneId, updates) => {
                const story = get().currentStory;
                if (!story) return;

                const chapter = story.chapters.find((c) => c.id === chapterId);
                if (!chapter) return;

                get().updateChapter(chapterId, {
                    scenes: chapter.scenes.map((s) =>
                        s.id === sceneId ? { ...s, ...updates } : s
                    ),
                });
            },

            deleteScene: (chapterId, sceneId) => {
                const story = get().currentStory;
                if (!story) return;

                const chapter = story.chapters.find((c) => c.id === chapterId);
                if (!chapter) return;

                get().updateChapter(chapterId, {
                    scenes: chapter.scenes.filter((s) => s.id !== sceneId),
                });
            },

            reorderScenes: (chapterId, sceneIds) => {
                const story = get().currentStory;
                if (!story) return;

                const chapter = story.chapters.find((c) => c.id === chapterId);
                if (!chapter) return;

                const reordered = sceneIds.map((id, index) => {
                    const scene = chapter.scenes.find((s) => s.id === id);
                    return scene ? { ...scene, order: index + 1 } : null;
                }).filter(Boolean) as SceneBlueprint[];

                get().updateChapter(chapterId, { scenes: reordered });
            },

            saveChanges: () => {
                set({ hasUnsavedChanges: false });
            },

            markUnsaved: () => {
                set({ hasUnsavedChanges: true });
            },
        }),
        {
            name: 'zzelix-creator-store',
        }
    )
);
