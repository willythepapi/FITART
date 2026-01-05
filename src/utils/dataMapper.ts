import { Game } from '@/types';
import { CreatorStory, StoryChapter, SceneBlueprint } from '@/types/creatorTypes';

export function mapGameToCreatorStory(game: Game): CreatorStory {
    return {
        id: game.id,
        title: game.title,
        description: game.description,
        synopsis: game.synopsis,
        category: game.genre[0] as any, // Simple mapping, fallback to first genre
        rating: game.rating,
        posters: {
            thumbnail: game.coverImage,
            banner: game.bannerImage,
            portrait: game.coverImage, // Use cover as portrait fallback
        },
        chapters: Array.from({ length: game.episodeCount }).map((_, i) => ({
            id: `chapter_${game.id}_${i + 1}`,
            title: `Episode ${i + 1}`,
            order: i + 1,
            scenes: [] // Mock scenes, normally would be populated
        })),
        status: 'published', // Default mock games are published
        publishDate: new Date(game.releaseDate),
        tags: game.tags,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        creatorId: 'system',
    };
}

export function mapCreatorStoryToGame(story: CreatorStory): Game {
    return {
        id: story.id,
        title: story.title,
        description: story.description,
        synopsis: story.synopsis,
        coverImage: story.posters.thumbnail || '/images/placeholders/cover.jpg',
        bannerImage: story.posters.banner || '/images/placeholders/banner.jpg',
        developer: 'You', // In a real app this would be the creator's name
        releaseDate: story.publishDate ? new Date(story.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        genre: [story.category],
        rating: story.rating,
        episodeCount: story.chapters.length,
        totalPlaytime: '2-4 hours', // Placeholder
        tags: story.tags || [],
        isFeatured: false, // Default
        isOriginal: true,
    };
}
