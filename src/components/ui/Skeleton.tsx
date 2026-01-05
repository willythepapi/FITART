'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
    const baseClass = 'shimmer bg-[var(--zz-bg-card)]';
    const variantClass = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    return (
        <div className={`${baseClass} ${variantClass[variant]} ${className}`} />
    );
}

// Game Card Skeleton
export function GameCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeStyles = {
        sm: 'w-40 h-56',
        md: 'w-52 h-72',
        lg: 'w-64 h-96',
    };

    return (
        <div className={`${sizeStyles[size]} rounded-xl overflow-hidden flex-shrink-0`}>
            <Skeleton className="w-full h-[80%]" />
            <div className="p-3 space-y-2 bg-[var(--zz-bg-card)]">
                <Skeleton className="h-4 w-3/4" variant="text" />
                <Skeleton className="h-3 w-1/2" variant="text" />
            </div>
        </div>
    );
}

// Continue Playing Card Skeleton
export function ContinuePlayingCardSkeleton() {
    return (
        <div className="w-80 h-44 rounded-xl overflow-hidden flex-shrink-0">
            <Skeleton className="w-full h-full" />
        </div>
    );
}

// Hero Section Skeleton
export function HeroSkeleton() {
    return (
        <div className="relative h-[85vh] min-h-[600px] w-full bg-[var(--zz-bg-coal)]">
            <div className="absolute inset-0 shimmer" />
            <div className="absolute bottom-32 left-8 space-y-4 max-w-2xl">
                <Skeleton className="h-6 w-32" variant="text" />
                <Skeleton className="h-16 w-96" variant="text" />
                <Skeleton className="h-4 w-80" variant="text" />
                <div className="flex gap-4 mt-6">
                    <Skeleton className="h-12 w-32 rounded-xl" />
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// Category Row Skeleton
export function CategoryRowSkeleton() {
    return (
        <div className="py-6">
            <div className="px-8 mb-4">
                <Skeleton className="h-8 w-48" variant="text" />
            </div>
            <div className="flex gap-4 px-8 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                    <GameCardSkeleton key={i} size="md" />
                ))}
            </div>
        </div>
    );
}

// Page Loading Overlay
export function PageLoadingOverlay() {
    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[var(--zz-bg-deep)] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <svg
                        width={80}
                        height={80}
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8A2BE2" />
                                <stop offset="100%" stopColor="#00FFFF" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M20 25 L80 25 L30 75 L80 75"
                            stroke="url(#loadingGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    </svg>
                </motion.div>

                {/* Loading Bar */}
                <div className="w-48 h-1 bg-[var(--zz-bg-card)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple to-cyan"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <motion.p
                    className="text-text-secondary text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading your experience...
                </motion.p>
            </div>
        </motion.div>
    );
}
