'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import { Game, UserProgress } from '@/types';
import { useState } from 'react';

interface GameCardProps {
    game: Game;
    progress?: UserProgress;
    showProgress?: boolean;
    index?: number;
    totalCards?: number;
}

// Netflix-style badge component
function Badge({ type, text }: { type: 'new' | 'top10' | 'season' | 'episode' | 'original'; text?: string }) {
    if (type === 'top10') {
        return (
            <div className="flex items-center">
                <div className="bg-[#e50914] px-1.5 py-0.5 flex items-center gap-0.5 rounded-sm">
                    <span className="text-white font-bold text-[9px] leading-none">TOP</span>
                    <span className="text-white font-bold text-xs leading-none">10</span>
                </div>
            </div>
        );
    }

    if (type === 'original') {
        return (
            <div className="h-5 flex items-center">
                <img
                    src="/zzelixlogo.png"
                    alt="Zzelix Original"
                    className="h-4 w-auto object-contain"
                />
            </div>
        );
    }

    const label = type === 'new' ? 'Yeni Eklendi' : type === 'season' ? 'Yeni Sezon' : 'Yeni Bölüm';

    return (
        <div className="bg-[#e50914] px-2 py-1 rounded-sm">
            <span className="text-white font-semibold text-[11px]">{text || label}</span>
        </div>
    );
}

export function GameCard({ game, progress, showProgress = false, index = 0, totalCards = 6 }: GameCardProps) {
    const hasProgress = showProgress && progress && progress.progressPercent > 0;
    const [isHovered, setIsHovered] = useState(false);

    // Determine transform origin based on position
    const isFirst = index === 0;
    const isLast = index === totalCards - 1;
    const transformOrigin = isFirst ? 'left center' : isLast ? 'right center' : 'center center';

    return (
        <div
            className="relative flex-shrink-0"
            style={{
                width: 'calc((100% - 5 * 4px) / 6)',
                zIndex: isHovered ? 100 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative cursor-pointer"
                style={{ transformOrigin }}
                animate={isHovered ? {
                    scale: 1.5,
                    transition: { duration: 0.3, delay: 0.8 }
                } : {
                    scale: 1,
                    transition: { duration: 0.2 }
                }}
            >
                {/* Main Card */}
                <div className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: '16/9' }}>
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg,
                hsl(${(game.id.charCodeAt(0) * 20) % 360}, 40%, 35%) 0%,
                hsl(${(game.id.charCodeAt(1) * 25) % 360}, 30%, 18%) 100%)`,
                        }}
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {game.isOriginal && <Badge type="original" />}
                    </div>

                    <div className="absolute top-2 right-2 z-10">
                        {game.isFeatured && <Badge type="top10" />}
                    </div>

                    {game.isFeatured && (
                        <div className="absolute bottom-2 left-2 z-10">
                            <Badge type="new" />
                        </div>
                    )}

                    {hasProgress && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 z-10">
                            <div className="h-full bg-[#e50914]" style={{ width: `${progress.progressPercent}%` }} />
                        </div>
                    )}
                </div>

                {/* Expanded Info Panel - Shows on hover */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            className="absolute left-0 right-0 bg-[#181818] rounded-b-md shadow-2xl"
                            style={{ top: '100%' }}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-3">
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mb-2">
                                    <Link href={`/play/${game.id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors">
                                            <Play className="size-4 text-black fill-black ml-0.5" />
                                        </button>
                                    </Link>

                                    <button className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white transition-colors group">
                                        <Plus className="size-4 text-gray-400 group-hover:text-white" />
                                    </button>

                                    <button className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white transition-colors group">
                                        <ThumbsUp className="size-3.5 text-gray-400 group-hover:text-white" />
                                    </button>

                                    <div className="flex-1" />

                                    <Link href={`/game/${game.id}`} onClick={(e) => e.stopPropagation()}>
                                        <button className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white transition-colors group">
                                            <ChevronDown className="size-4 text-gray-400 group-hover:text-white" />
                                        </button>
                                    </Link>
                                </div>

                                {/* Title */}
                                <h3 className="text-white text-sm font-semibold mb-1 truncate">{game.title}</h3>

                                {/* Metadata */}
                                <div className="flex items-center gap-2 text-[10px] mb-1.5">
                                    <span className="text-green-500 font-semibold">%98 Eşleşme</span>
                                    <span className="px-1 py-0.5 border border-gray-500 text-gray-400">
                                        {game.rating === 'mature' ? '18+' : '16+'}
                                    </span>
                                    <span className="text-gray-400">{game.episodeCount} Bölüm</span>
                                    <span className="px-1 border border-gray-500 text-gray-400 rounded text-[9px]">HD</span>
                                </div>

                                {/* Genres */}
                                <div className="flex items-center gap-1 text-[10px] text-gray-300">
                                    {game.genre.slice(0, 3).map((g, i) => (
                                        <span key={g} className="flex items-center">
                                            {i > 0 && <span className="text-gray-500 mx-1">•</span>}
                                            {g.charAt(0).toUpperCase() + g.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Title below card - only when not hovered */}
            {!isHovered && (
                <div className="mt-1.5">
                    <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
                </div>
            )}
        </div>
    );
}

// Continue Playing Card
export function ContinuePlayingCard({
    game,
    progress,
    index = 0,
    totalCards = 6
}: {
    game: Game;
    progress: UserProgress;
    index?: number;
    totalCards?: number;
}) {
    const [isHovered, setIsHovered] = useState(false);

    const isFirst = index === 0;
    const isLast = index === totalCards - 1;
    const transformOrigin = isFirst ? 'left center' : isLast ? 'right center' : 'center center';

    return (
        <div
            className="relative flex-shrink-0"
            style={{
                width: 'calc((100% - 5 * 4px) / 6)',
                zIndex: isHovered ? 100 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative cursor-pointer"
                style={{ transformOrigin }}
                animate={isHovered ? {
                    scale: 1.5,
                    transition: { duration: 0.3, delay: 0.8 }
                } : {
                    scale: 1,
                    transition: { duration: 0.2 }
                }}
            >
                <div className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: '16/9' }}>
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(135deg,
                hsl(${(game.id.charCodeAt(0) * 15) % 360}, 35%, 30%) 0%,
                hsl(${(game.id.charCodeAt(2) * 20) % 360}, 25%, 15%) 100%)`,
                        }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 z-10">
                        <div className="h-full bg-[#e50914]" style={{ width: `${progress.progressPercent}%` }} />
                    </div>
                </div>

                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            className="absolute left-0 right-0 bg-[#181818] rounded-b-md shadow-2xl"
                            style={{ top: '100%' }}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <Link href={`/play/${game.id}`}>
                                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200">
                                            <Play className="size-4 text-black fill-black ml-0.5" />
                                        </button>
                                    </Link>
                                    <button className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white">
                                        <Plus className="size-4 text-gray-400" />
                                    </button>
                                    <div className="flex-1" />
                                    <Link href={`/game/${game.id}`}>
                                        <button className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white">
                                            <ChevronDown className="size-4 text-gray-400" />
                                        </button>
                                    </Link>
                                </div>
                                <h3 className="text-white text-sm font-semibold mb-1">{game.title}</h3>
                                <p className="text-gray-400 text-[10px]">E{progress.currentEpisode} • {progress.progressPercent}% tamamlandı</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {!isHovered && (
                <div className="mt-1.5">
                    <h3 className="text-white text-xs font-medium truncate">{game.title}</h3>
                </div>
            )}
        </div>
    );
}
