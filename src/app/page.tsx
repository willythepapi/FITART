'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryRow, ContinuePlayingRow } from '@/components/home/CategoryRow';
import { useCreatorStore } from '@/store/creatorStore';
import { mockUserProgress } from '@/data/mockGames';
import { mapCreatorStoryToGame } from '@/utils/dataMapper';
import { Game } from '@/types';

export default function HomePage() {
  // Client-side hydration issues avoidance
  const [mounted, setMounted] = useState(false);
  const stories = useCreatorStore((state) => state.stories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#141414]" />;

  // --- ALGORITHM: LOGIC FOR SELECTING HERO & CATEGORIES ---

  const now = new Date();

  // 1. Convert all CreatorStories to Games
  const allGames: Game[] = stories.map(mapCreatorStoryToGame);

  // 2. Filter for Published & Scheduled
  const publishedGames = allGames.filter(g => new Date(g.releaseDate) <= now);
  const scheduledGames = allGames.filter(g => new Date(g.releaseDate) > now);

  // 3. Determine Hero Game (Upcoming Logic)
  // Priority:
  // A. Closest upcoming release (Scheduled)
  // B. Newly released (last 7 days)
  // C. Default Featured

  let heroGame = publishedGames.find(g => g.isFeatured) || publishedGames[0];

  if (scheduledGames.length > 0) {
    // Sort by release date ascending (closest first)
    scheduledGames.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    heroGame = scheduledGames[0];
    // Add "Upcoming" tag or similar visual indicator logic (handled in HeroSection ideally via props, but we'll use game data)
  } else {
    // Check for new releases
    const newReleases = publishedGames.filter(g => {
      const diffTime = Math.abs(now.getTime() - new Date(g.releaseDate).getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    });

    if (newReleases.length > 0) {
      heroGame = newReleases[0];
    }
  }

  // 4. Categories Logic
  const trendingGames = publishedGames.slice(0, 8); // Simplification for demo
  const originalGames = publishedGames.filter(g => g.isOriginal);
  const romanceGames = publishedGames.filter(g => g.genre.includes('romance'));
  const mysteryGames = publishedGames.filter(g => g.genre.includes('mystery'));
  const newReleases = publishedGames.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero */}
      {heroGame && <HeroSection game={heroGame} />}

      {/* Content Rows - overlapping hero slightly */}
      <div className="relative -mt-32 z-20 pb-16">
        {/* Continue Playing - keeping mock for user progress for now as per plan */}
        <ContinuePlayingRow progressData={mockUserProgress} />

        {/* Categories */}
        {scheduledGames.length > 0 && (
          <CategoryRow
            title="Çok Yakında / Coming Soon"
            games={scheduledGames}
          />
        )}

        <CategoryRow
          title="Trending Now"
          games={trendingGames.slice(0, 10)}
        />

        <CategoryRow title="Zzelix Originals" games={originalGames} />
        <CategoryRow title="Romantic Stories" games={romanceGames} />
        <CategoryRow title="Mystery & Thriller" games={mysteryGames} />
        <CategoryRow title="New Releases" games={newReleases} />
      </div>
    </div>
  );
}
