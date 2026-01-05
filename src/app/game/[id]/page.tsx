'use client';

import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Play,
    Plus,
    Share2,
    Clock,
    Calendar,
    User,
    Star,
    ChevronRight,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GameCard } from '@/components/ui/GameCard';
import { mockGames, mockCategories } from '@/data/mockGames';
import { use } from 'react';

interface GamePageProps {
    params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
    const { id } = use(params);
    const game = mockGames.find((g) => g.id === id);

    if (!game) {
        notFound();
    }

    const relatedGames = mockGames
        .filter((g) => g.id !== game.id && g.genre.some((genre) => game.genre.includes(genre)))
        .slice(0, 6);

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <div className="relative h-[70vh] min-h-[500px]">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-purple/30 via-[var(--zz-bg-deep)] to-cyan/10"
                    style={{
                        backgroundImage: game.bannerImage ? `url(${game.bannerImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--zz-bg-deep)] via-[var(--zz-bg-deep)]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--zz-bg-deep)] via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12 flex flex-col justify-end">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {game.isOriginal && (
                                <span className="px-3 py-1 bg-gradient-to-r from-purple to-purple-light text-white text-xs font-bold rounded-full">
                                    ⚡ ZZELIX ORIGINAL
                                </span>
                            )}
                            {game.rating === 'mature' && (
                                <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                                    18+
                                </span>
                            )}
                            {game.genre.map((g) => (
                                <span
                                    key={g}
                                    className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded-full capitalize"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {game.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-4" />
                                <span>{game.totalPlaytime}</span>
                            </div>
                            <span className="text-white/30">|</span>
                            <div className="flex items-center gap-1.5">
                                <ChevronRight className="size-4" />
                                <span>{game.episodeCount} Episodes</span>
                            </div>
                            <span className="text-white/30">|</span>
                            <div className="flex items-center gap-1.5">
                                <User className="size-4" />
                                <span>{game.developer}</span>
                            </div>
                            <span className="text-white/30">|</span>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="size-4" />
                                <span>{new Date(game.releaseDate).getFullYear()}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href={`/play/${game.id}`}>
                                <Button size="lg" leftIcon={<Play className="size-5 fill-white" />}>
                                    Play Now
                                </Button>
                            </Link>
                            <Button size="lg" variant="secondary" leftIcon={<Plus className="size-5" />}>
                                Add to My List
                            </Button>
                            <Button size="lg" variant="ghost" leftIcon={<Heart className="size-5" />}>
                                Favorite
                            </Button>
                            <Button size="lg" variant="ghost" leftIcon={<Share2 className="size-5" />}>
                                Share
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Synopsis */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Synopsis</h2>
                            <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                                {game.synopsis}
                            </div>
                        </motion.section>

                        {/* Episodes Preview */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>
                            <div className="space-y-3">
                                {Array.from({ length: Math.min(game.episodeCount, 5) }, (_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--zz-bg-card)] hover:bg-[var(--zz-bg-elevated)] transition-colors group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold group-hover:bg-purple group-hover:text-white transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-white">Episode {i + 1}</h3>
                                            <p className="text-sm text-text-secondary">
                                                {i === 0 ? 'Free to play' : 'Premium'}
                                            </p>
                                        </div>
                                        <Play className="size-5 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {game.episodeCount > 5 && (
                                    <p className="text-center text-text-secondary text-sm py-2">
                                        +{game.episodeCount - 5} more episodes
                                    </p>
                                )}
                            </div>
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Tags */}
                        <div className="p-6 rounded-xl bg-[var(--zz-bg-card)] border border-white/5">
                            <h3 className="text-sm font-semibold text-text-secondary mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {game.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1.5 bg-white/5 hover:bg-purple/20 text-white text-sm rounded-full cursor-pointer transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="p-6 rounded-xl bg-[var(--zz-bg-card)] border border-white/5 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary mb-1">Developer</h3>
                                <p className="text-white">{game.developer}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary mb-1">Release Date</h3>
                                <p className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-text-secondary mb-1">Content Rating</h3>
                                <p className="text-white capitalize">{game.rating}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Related Games */}
                {relatedGames.length > 0 && (
                    <motion.section
                        className="mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-xl font-bold text-white mb-6">You Might Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {relatedGames.map((relatedGame) => (
                                <GameCard key={relatedGame.id} game={relatedGame} size="sm" />
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
