'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard, ContinuePlayingCard } from '@/components/ui/GameCard';
import { Game } from '@/types';
import { mockGames } from '@/data/mockGames';

const CARDS_PER_PAGE = 6;

interface CategoryRowProps {
    title: string;
    games: Game[];
}

export function CategoryRow({ title, games }: CategoryRowProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [showArrows, setShowArrows] = useState(false);
    const totalPages = Math.ceil(games.length / CARDS_PER_PAGE);

    const currentGames = games.slice(
        currentPage * CARDS_PER_PAGE,
        (currentPage + 1) * CARDS_PER_PAGE
    );

    const goToPage = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Arrows visible immediately on row hover, no delay
    const handleMouseEnter = () => {
        setShowArrows(true);
    };

    const handleMouseLeave = () => {
        setShowArrows(false);
    };

    if (games.length === 0) return null;

    return (
        <section
            className="relative mb-16"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Title */}
            <div className="flex items-center justify-between mb-1 px-[4%]">
                <h2 className="text-sm md:text-base font-medium text-white hover:text-gray-300 cursor-pointer inline-flex items-center gap-1 group">
                    {title}
                    <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
                </h2>

                {/* Page indicators - always visible when multiple pages */}
                {totalPages > 1 && (
                    <div
                        className="flex gap-0.5 transition-opacity duration-200"
                        style={{ opacity: showArrows ? 1 : 0 }}
                    >
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-0.5 rounded-full transition-colors ${i === currentPage ? 'bg-gray-300' : 'bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative">
                {/* Left Arrow - CSS transition instead of AnimatePresence for stability */}
                {currentPage > 0 && (
                    <button
                        onClick={() => goToPage('prev')}
                        className="absolute left-0 top-0 h-[140px] z-[150] w-[4%] min-w-[40px] bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 rounded-r"
                        style={{
                            opacity: showArrows ? 1 : 0,
                            pointerEvents: showArrows ? 'auto' : 'none'
                        }}
                    >
                        <ChevronLeft className="size-10 text-white" strokeWidth={3} />
                    </button>
                )}

                {/* Cards Container */}
                <div className="px-[4%]">
                    <motion.div
                        key={currentPage}
                        className="flex gap-1"
                        initial={{ x: 50, opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {currentGames.map((game, index) => (
                            <GameCard key={game.id} game={game} index={index} totalCards={currentGames.length} />
                        ))}
                    </motion.div>
                </div>

                {/* Right Arrow - CSS transition for stability */}
                {currentPage < totalPages - 1 && (
                    <button
                        onClick={() => goToPage('next')}
                        className="absolute right-0 top-0 h-[140px] z-[150] w-[4%] min-w-[40px] bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 rounded-l"
                        style={{
                            opacity: showArrows ? 1 : 0,
                            pointerEvents: showArrows ? 'auto' : 'none'
                        }}
                    >
                        <ChevronRight className="size-10 text-white" strokeWidth={3} />
                    </button>
                )}
            </div>
        </section>
    );
}

// Continue Watching Row
interface ContinuePlayingRowProps {
    progressData: { gameId: string; currentEpisode: number; progressPercent: number; lastPlayedAt: Date; totalPlaytime: number }[];
}

export function ContinuePlayingRow({ progressData }: ContinuePlayingRowProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [showArrows, setShowArrows] = useState(false);

    const gamesWithProgress = progressData
        .map(p => ({ game: mockGames.find(g => g.id === p.gameId), progress: p }))
        .filter(item => item.game !== undefined);

    const totalPages = Math.ceil(gamesWithProgress.length / CARDS_PER_PAGE);
    const currentItems = gamesWithProgress.slice(
        currentPage * CARDS_PER_PAGE,
        (currentPage + 1) * CARDS_PER_PAGE
    );

    const goToPage = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleMouseEnter = () => {
        setShowArrows(true);
    };

    const handleMouseLeave = () => {
        setShowArrows(false);
    };

    if (gamesWithProgress.length === 0) return null;

    return (
        <section
            className="relative mb-16"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center justify-between mb-1 px-[4%]">
                <h2 className="text-sm md:text-base font-medium text-white hover:text-gray-300 cursor-pointer inline-flex items-center gap-1 group">
                    Continue Watching
                    <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity text-cyan" />
                </h2>

                {totalPages > 1 && (
                    <div
                        className="flex gap-0.5 transition-opacity duration-200"
                        style={{ opacity: showArrows ? 1 : 0 }}
                    >
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-0.5 rounded-full ${i === currentPage ? 'bg-gray-300' : 'bg-gray-600'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="relative">
                {currentPage > 0 && (
                    <button
                        onClick={() => goToPage('prev')}
                        className="absolute left-0 top-0 h-[140px] z-[150] w-[4%] min-w-[40px] bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 rounded-r"
                        style={{
                            opacity: showArrows ? 1 : 0,
                            pointerEvents: showArrows ? 'auto' : 'none'
                        }}
                    >
                        <ChevronLeft className="size-10 text-white" strokeWidth={3} />
                    </button>
                )}

                <div className="px-[4%]">
                    <motion.div
                        key={currentPage}
                        className="flex gap-1"
                        initial={{ x: 50, opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {currentItems.map(({ game, progress }, index) => (
                            <ContinuePlayingCard
                                key={game!.id}
                                game={game!}
                                progress={{ ...progress, gameId: game!.id, saveSlots: [] }}
                                index={index}
                                totalCards={currentItems.length}
                            />
                        ))}
                    </motion.div>
                </div>

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={() => goToPage('next')}
                        className="absolute right-0 top-0 h-[140px] z-[150] w-[4%] min-w-[40px] bg-black/60 hover:bg-black/80 flex items-center justify-center transition-all duration-200 rounded-l"
                        style={{
                            opacity: showArrows ? 1 : 0,
                            pointerEvents: showArrows ? 'auto' : 'none'
                        }}
                    >
                        <ChevronRight className="size-10 text-white" strokeWidth={3} />
                    </button>
                )}
            </div>
        </section>
    );
}
