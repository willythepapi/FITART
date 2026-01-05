'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { mockGames } from '@/data/mockGames';
import { useCreatorStore } from '@/store/creatorStore';
import { use } from 'react';

// Sound effects (placeholders - in a real app these would be assets)
// Ideally, use a hook like useSound from 'use-sound' but for now a simple function
const playSound = (type: 'hover' | 'click') => {
    // const audio = new Audio(type === 'hover' ? '/sounds/hover.mp3' : '/sounds/click.mp3');
    // audio.volume = 0.2;
    // audio.play().catch(() => {});
};

interface PlayPageProps {
    params: Promise<{ id: string }>;
}

const mockScenes = [
    {
        id: 'scene_1',
        type: 'video' as const,
        videoUrl: '/videos/scene1.mp4',
        duration: 15000,
        subtitle: 'The year is 2157. Dr. Maya Chen stands alone in her laboratory, staring at the artifact that changed everything.',
    },
    {
        id: 'scene_2',
        type: 'video' as const,
        videoUrl: '/videos/scene2.mp4',
        duration: 12000,
        subtitle: 'When she touches it, voices from across time begin to whisper. One voice stands out from the rest.',
    },
    {
        id: 'scene_3',
        type: 'video' as const,
        videoUrl: '/videos/scene3.mp4',
        duration: 18000,
        subtitle: '"Can you hear me? I know this sounds impossible, but I need your help. The future... your present... it\'s in danger."',
    },
    {
        id: 'scene_4',
        type: 'choice' as const,
        question: 'How do you respond to the mysterious voice?',
        choices: [
            { id: 'trust', text: 'Trust the voice and ask how you can help', nextScene: 'scene_5a' },
            { id: 'skeptical', text: 'Demand proof before believing anything', nextScene: 'scene_5b' },
            { id: 'ignore', text: 'Dismiss it as a malfunction and walk away', nextScene: 'scene_5c' },
        ],
    },
    {
        id: 'scene_5',
        type: 'video' as const,
        videoUrl: '/videos/scene5.mp4',
        duration: 20000,
        subtitle: 'As the connection strengthens, you begin to see glimpses of his world - a world 133 years in your past.',
    },
];

export default function PlayPage({ params }: PlayPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { stories } = useCreatorStore();
    const game = stories.find(s => s.id === id); // Find in creator store

    // Derived state from game data
    const scenes = game?.chapters[0]?.scenes || [];

    // UI State
    const [currentSceneId, setCurrentSceneId] = useState<string | null>(scenes[0]?.id || null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const [showSubtitle, setShowSubtitle] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Find current scene object
    const currentScene = scenes.find(s => s.id === currentSceneId);
    // Calculate progress based on visits or simple linear approximation if order is available
    const progress = scenes.indexOf(currentScene!) / scenes.length;

    // Keyboard controls
    useEffect(() => {
        if (!currentScene) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTransitioning) return;

            // Space to advance (if no choices or defaults to next)
            if (e.code === 'Space' && !currentScene.choices?.length && currentScene.nextSceneId) {
                e.preventDefault();
                playSound('click');
                handleChoice(currentScene.nextSceneId);
            }

            // Numeric keys for choices (if choices exist)
            if (currentScene.choices?.length) {
                const num = parseInt(e.key);
                if (num > 0 && num <= currentScene.choices.length) {
                    playSound('click');
                    handleChoice(currentScene.choices[num - 1].nextSceneId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSceneId, isTransitioning, currentScene]);

    // UI Auto-hide
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const resetTimeout = () => {
            setShowUI(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setShowUI(false), 3000);
        };
        window.addEventListener('mousemove', resetTimeout);
        resetTimeout();
        return () => {
            window.removeEventListener('mousemove', resetTimeout);
            clearTimeout(timeout);
        };
    }, []);

    if (!game || !currentScene) {
        if (game && !currentScene) return <div className="text-white flex justify-center items-center h-screen">Error: Scene not found or empty story.</div>;
        return notFound();
    }

    const handleChoice = (nextSceneId: string) => {
        if (!nextSceneId) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSceneId(nextSceneId);
            setTimeout(() => setIsTransitioning(false), 500);
        }, 300);
    };

    const transitionTo = (index: number) => {
        setIsTransitioning(true);
        // Add a slight delay for the transition effect
        setTimeout(() => {
            setCurrentSceneIndex(index);
            // Wait for transition animation to complete
            setTimeout(() => setIsTransitioning(false), 500);
        }, 300);
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black z-50 select-none cursor-pointer overflow-hidden font-sans"
            onClick={() => !currentScene.choices?.length && currentScene.nextSceneId && handleChoice(currentScene.nextSceneId)}
        >
            {/* Cinematic Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        className="absolute inset-0 z-40 bg-black"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                )}
            </AnimatePresence>

            {/* Scene Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSceneIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Background Visualization - Using image or gradient fallback */}
                    {currentScene.backgroundImage ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentScene.backgroundImage})` }}
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(ellipse at center, hsl(260, 40%, 15%) 0%, hsl(240, 30%, 5%) 100%)`
                            }}
                        />
                    )}

                    {/* Cinematic Bars with Animation */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-10"
                        initial={{ y: '-100%' }}
                        animate={{ y: '0%' }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-10"
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                    />

                    {/* Choice Screen */}
                    {currentScene.choices && currentScene.choices.length > 0 && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
                            <motion.h2
                                className="text-3xl md:text-5xl font-bold text-white text-center mb-12 max-w-4xl leading-tight drop-shadow-2xl"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {currentScene.dialog.text}
                            </motion.h2>

                            <div className="grid gap-4 w-full max-w-2xl">
                                {currentScene.choices.map((choice, index) => (
                                    <motion.button
                                        key={choice.id}
                                        className="group relative p-6 w-full text-left rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple/50 transition-all duration-300 overflow-hidden"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playSound('click');
                                            handleChoice(choice.nextSceneId);
                                        }}
                                        onMouseEnter={() => playSound('hover')}
                                        whileHover={{ scale: 1.02, x: 10 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative flex items-center gap-4">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-sm font-mono text-white/50 group-hover:text-purple group-hover:border-purple transition-colors">
                                                {index + 1}
                                            </span>
                                            <span className="text-lg md:text-xl text-white group-hover:text-purple-100 font-medium tracking-wide">
                                                {choice.text}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subtitle / Dialog */}
                    {(!currentScene.choices || currentScene.choices.length === 0) && currentScene.dialog.text && showSubtitle && (
                        <motion.div
                            className="absolute bottom-[13vh] left-0 right-0 flex flex-col items-center z-30 px-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {currentScene.dialog.speaker && currentScene.dialog.speaker !== 'Narrator' && (
                                <span className="text-purple-300 font-bold mb-2 tracking-widest uppercase text-sm bg-black/50 px-3 py-1 rounded">
                                    {currentScene.dialog.speaker}
                                </span>
                            )}
                            <p className="text-white/90 text-lg md:text-2xl font-medium text-center max-w-4xl leading-relaxed drop-shadow-lg bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/5">
                                {currentScene.dialog.text}
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Top UI Overlay */}
            <AnimatePresence>
                {showUI && (
                    <motion.div
                        className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-30 pointer-events-none"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <button
                                onClick={() => router.push(`/game/${game.id}`)}
                                className="p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group"
                            >
                                <ArrowLeft className="size-5 text-white/70 group-hover:text-white" />
                            </button>
                            <div className="hidden md:block">
                                <h1 className="font-bold text-white/90 text-lg tracking-wide">{game.title}</h1>
                                <div className="flex items-center gap-2 text-xs text-white/50 uppercase tracking-widest">
                                    <span>Episode 1</span>
                                    <span className="w-1 h-1 rounded-full bg-white/30" />
                                    <span>{(progress * 100).toFixed(0)}% Complete</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pointer-events-auto">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                                className="p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all"
                            >
                                {isMuted ? <VolumeX className="size-5 text-white" /> : <Volume2 className="size-5 text-white" />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                                className="p-3 rounded-full bg-black/20 backdrop-blur-md hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all"
                            >
                                {isFullscreen ? <Minimize className="size-5 text-white" /> : <Maximize className="size-5 text-white" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip / Next Hint */}
            <AnimatePresence>
                {showUI && !currentScene.choices?.length && currentScene.nextSceneId && (
                    <motion.div
                        className="absolute bottom-6 right-6 z-30 pointer-events-auto"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); handleChoice(currentScene.nextSceneId!); }}
                            className="flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm transition-all group"
                        >
                            <span className="text-sm font-medium text-white/70 group-hover:text-white uppercase tracking-wider">Devam Et</span>
                            <SkipForward className="size-4 text-white/50 group-hover:text-white" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-40">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple via-cyan to-purple bg-[length:200%_100%] animate-pulse"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                />
            </div>
        </div>
    );
}
