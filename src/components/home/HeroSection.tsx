'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Game } from '@/types';

interface HeroSectionProps {
    game: Game;
}

export function HeroSection({ game }: HeroSectionProps) {
    const [isMuted, setIsMuted] = useState(true);

    return (
        <section className="relative w-full" style={{ height: '80vh', minHeight: '500px' }}>
            {/* Background */}
            <div className="absolute inset-0">
                {/* Gradient placeholder for featured content */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(90deg, #141414 0%, transparent 50%),
                         linear-gradient(0deg, #141414 0%, transparent 40%),
                         linear-gradient(135deg,
                           hsl(270, 40%, 25%) 0%,
                           hsl(260, 30%, 15%) 50%,
                           hsl(200, 40%, 20%) 100%)`,
                    }}
                />
            </div>

            {/* Content */}
            <div className="absolute bottom-[35%] left-[4%] max-w-lg z-10">
                {/* Logo/Title Badge */}
                {game.isOriginal && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold tracking-widest text-gray-400">Z SERIES</span>
                    </div>
                )}

                {/* Title - Large */}
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {game.title}
                </h1>

                {/* Description */}
                <p className="text-base text-gray-200 mb-5 line-clamp-3 drop-shadow">
                    {game.description}
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                    <Link href={`/play/${game.id}`}>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-semibold rounded text-base hover:bg-gray-200 transition-colors">
                            <Play className="size-6 fill-black" />
                            Play
                        </button>
                    </Link>

                    <Link href={`/game/${game.id}`}>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-gray-500/70 text-white font-semibold rounded text-base hover:bg-gray-500/50 transition-colors">
                            <Info className="size-6" />
                            More Info
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right side - Age rating + Mute */}
            <div className="absolute bottom-[35%] right-[4%] flex items-center gap-3 z-10">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:border-white transition-colors"
                >
                    {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
                </button>
                <div className="px-3 py-1 bg-gray-700/80 border-l-2 border-white text-sm text-white">
                    {game.rating === 'mature' ? '18+' : '16+'}
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />
        </section>
    );
}
