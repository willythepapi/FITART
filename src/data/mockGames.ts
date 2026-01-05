import { Game, Category } from '@/types';

// Sample game cover images (using placeholder gradients represented by colors)
// In production, these would be actual image URLs from CDN

export const mockGames: Game[] = [
    {
        id: 'echoes-of-tomorrow',
        title: 'Echoes of Tomorrow',
        description: 'A sci-fi romance spanning across time and dimensions.',
        synopsis: `In the year 2157, Dr. Maya Chen discovers a mysterious artifact that allows her to communicate across timelines. As she unravels the secrets of temporal communication, she finds herself falling for a voice from the past - a physicist from 2024 who holds the key to preventing a catastrophic future.

Navigate complex moral dilemmas, forge connections that transcend time, and choose between saving the world or following your heart. Every decision ripples through time, creating consequences that echo into tomorrow.`,
        coverImage: '/images/games/echoes-cover.jpg',
        bannerImage: '/images/games/echoes-banner.jpg',
        developer: 'Temporal Studios',
        releaseDate: '2025-08-15',
        genre: ['sci-fi', 'romance', 'drama'],
        rating: 'mature',
        episodeCount: 12,
        totalPlaytime: '10-15 hours',
        tags: ['Time Travel', 'Multiple Endings', 'Romance', 'Sci-Fi'],
        isFeatured: true,
        isOriginal: true,
    },
    {
        id: 'midnight-academy',
        title: 'Midnight Academy',
        description: 'Uncover dark secrets in an elite supernatural school.',
        synopsis: `Welcome to Ravenwood Academy, where the elite of the supernatural world send their children. As a human who accidentally gained admission, you must navigate treacherous politics, forbidden romances, and ancient mysteries.

But something dark lurks in the academy's shadows. Students are disappearing, and the headmaster seems to know more than he's letting on. Will you uncover the truth, or become the next victim?`,
        coverImage: '/images/games/midnight-cover.jpg',
        bannerImage: '/images/games/midnight-banner.jpg',
        developer: 'Shadow Ink Games',
        releaseDate: '2025-10-01',
        genre: ['mystery', 'fantasy', 'romance'],
        rating: 'mature',
        episodeCount: 15,
        totalPlaytime: '12-18 hours',
        tags: ['Supernatural', 'Academy', 'Mystery', 'Dark Romance'],
        isFeatured: false,
        isOriginal: false,
    },
    {
        id: 'corporate-hearts',
        title: 'Corporate Hearts',
        description: 'Love and ambition collide in the cutthroat business world.',
        synopsis: `Fresh out of business school, you land your dream job at Nexus Corp - one of the world's most powerful tech companies. But the corporate ladder is slippery, and you'll need more than talent to climb it.

Between demanding projects, office politics, and unexpected romantic interests, every choice matters. Will you compromise your values for success, or find a way to have it all?`,
        coverImage: '/images/games/corporate-cover.jpg',
        bannerImage: '/images/games/corporate-banner.jpg',
        developer: 'Modern Stories',
        releaseDate: '2025-06-20',
        genre: ['romance', 'drama', 'slice-of-life'],
        rating: 'mature',
        episodeCount: 10,
        totalPlaytime: '8-12 hours',
        tags: ['Office Romance', 'Drama', 'Modern', 'Career'],
        isFeatured: false,
        isOriginal: true,
    },
    {
        id: 'shadows-of-kyoto',
        title: 'Shadows of Kyoto',
        description: 'A tale of forbidden love in feudal Japan.',
        synopsis: `In the twilight of the Edo period, you are a young geisha-in-training at one of Kyoto's most prestigious establishments. When a mysterious ronin saves your life, you're drawn into a world of political intrigue and ancient secrets.

As revolution brews across Japan, you must choose between duty and desire, tradition and freedom. The shadows of Kyoto hold many secrets - and some are meant to stay hidden.`,
        coverImage: '/images/games/kyoto-cover.jpg',
        bannerImage: '/images/games/kyoto-banner.jpg',
        developer: 'Sakura Tales',
        releaseDate: '2025-04-10',
        genre: ['romance', 'drama', 'action'],
        rating: 'mature',
        episodeCount: 14,
        totalPlaytime: '14-20 hours',
        tags: ['Historical', 'Japan', 'Samurai', 'Forbidden Love'],
        isFeatured: true,
        isOriginal: false,
    },
    {
        id: 'stardust-cafe',
        title: 'Stardust Café',
        description: 'Inherit a magical café and find unexpected connections.',
        synopsis: `When your estranged grandmother leaves you a peculiar café in a small coastal town, you expect nothing but headaches. What you find instead is a magical establishment where dreams literally come true - and a cast of quirky regulars with their own stories.

As you restore the café to its former glory, you'll uncover your grandmother's secrets, help your customers find happiness, and maybe discover love in the most unexpected places.`,
        coverImage: '/images/games/stardust-cover.jpg',
        bannerImage: '/images/games/stardust-banner.jpg',
        developer: 'Cozy Games Studio',
        releaseDate: '2025-12-05',
        genre: ['romance', 'fantasy', 'slice-of-life', 'comedy'],
        rating: 'teen',
        episodeCount: 8,
        totalPlaytime: '6-10 hours',
        tags: ['Cozy', 'Magic', 'Small Town', 'Café'],
        isFeatured: false,
        isOriginal: true,
    },
    {
        id: 'neon-nights',
        title: 'Neon Nights',
        description: 'Cyberpunk noir romance in a rain-soaked megacity.',
        synopsis: `Neo-Shanghai, 2089. You're a private detective in a city where secrets are currency and trust is rarer than clean air. When a beautiful stranger walks into your office with a case that doesn't add up, you know you should walk away.

But you never could resist a mystery - or eyes like those. Navigate the neon-lit underworld, uncover corporate conspiracies, and fall for the one person you shouldn't trust.`,
        coverImage: '/images/games/neon-cover.jpg',
        bannerImage: '/images/games/neon-banner.jpg',
        developer: 'Pixel Noir',
        releaseDate: '2025-11-15',
        genre: ['sci-fi', 'romance', 'mystery'],
        rating: 'mature',
        episodeCount: 11,
        totalPlaytime: '10-14 hours',
        tags: ['Cyberpunk', 'Noir', 'Detective', 'Dark Romance'],
        isFeatured: true,
        isOriginal: false,
    },
    {
        id: 'haunted-hearts',
        title: 'Haunted Hearts',
        description: 'Can the living and dead find love beyond the veil?',
        synopsis: `After moving into a Victorian mansion to escape your past, you discover you're not alone. The ghost of a young man from the 1920s haunts the halls - and he's just as surprised to be seen as you are to see him.

As you unravel the mystery of his death, feelings begin to develop. But how can love exist between two worlds? And what secrets is the house still keeping?`,
        coverImage: '/images/games/haunted-cover.jpg',
        bannerImage: '/images/games/haunted-banner.jpg',
        developer: 'Spectral Stories',
        releaseDate: '2025-10-31',
        genre: ['romance', 'mystery', 'horror'],
        rating: 'mature',
        episodeCount: 9,
        totalPlaytime: '8-11 hours',
        tags: ['Supernatural', 'Gothic', 'Mystery', 'Paranormal Romance'],
        isFeatured: false,
        isOriginal: true,
    },
    {
        id: 'royal-scandals',
        title: 'Royal Scandals',
        description: 'A commoner in a world of crowns and conspiracies.',
        synopsis: `When a viral video accidentally makes you famous, you catch the eye of not one, but three royal siblings of the small European nation of Valdoria. Suddenly, you're swept into a world of luxury, politics, and danger.

As scandals threaten to topple the monarchy and enemies lurk in gilded corridors, you must choose your allies carefully. The crown may be heavy, but love makes everything bearable - or does it?`,
        coverImage: '/images/games/royal-cover.jpg',
        bannerImage: '/images/games/royal-banner.jpg',
        developer: 'Crown Games',
        releaseDate: '2025-02-14',
        genre: ['romance', 'drama'],
        rating: 'mature',
        episodeCount: 16,
        totalPlaytime: '15-20 hours',
        tags: ['Royalty', 'Drama', 'Modern', 'Love Triangle'],
        isFeatured: false,
        isOriginal: false,
    },
];

export const mockCategories: Category[] = [
    {
        id: 'trending',
        title: 'Trending Now',
        slug: 'trending',
        games: mockGames.filter(g => g.isFeatured || ['neon-nights', 'midnight-academy'].includes(g.id)),
    },
    {
        id: 'originals',
        title: 'Zzelix Originals',
        slug: 'originals',
        games: mockGames.filter(g => g.isOriginal),
    },
    {
        id: 'sci-fi-romance',
        title: 'Sci-Fi Romance',
        slug: 'sci-fi-romance',
        games: mockGames.filter(g => g.genre.includes('sci-fi')),
    },
    {
        id: 'mystery',
        title: 'Mystery & Thriller',
        slug: 'mystery',
        games: mockGames.filter(g => g.genre.includes('mystery') || g.genre.includes('horror')),
    },
    {
        id: 'fantasy',
        title: 'Fantasy Worlds',
        slug: 'fantasy',
        games: mockGames.filter(g => g.genre.includes('fantasy')),
    },
    {
        id: 'drama',
        title: 'Drama & Slice of Life',
        slug: 'drama',
        games: mockGames.filter(g => g.genre.includes('drama') || g.genre.includes('slice-of-life')),
    },
];

export const featuredGame = mockGames.find(g => g.id === 'echoes-of-tomorrow')!;

// Mock user progress for "Continue Playing" section
export const mockUserProgress = [
    {
        gameId: 'shadows-of-kyoto',
        currentEpisode: 5,
        progressPercent: 35,
        lastPlayedAt: new Date('2026-01-03'),
        totalPlaytime: 180,
    },
    {
        gameId: 'corporate-hearts',
        currentEpisode: 3,
        progressPercent: 25,
        lastPlayedAt: new Date('2026-01-02'),
        totalPlaytime: 120,
    },
    {
        gameId: 'stardust-cafe',
        currentEpisode: 7,
        progressPercent: 85,
        lastPlayedAt: new Date('2025-12-28'),
        totalPlaytime: 420,
    },
];
