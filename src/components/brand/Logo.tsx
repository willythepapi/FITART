'use client';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
    sm: { width: 80, height: 22 },
    md: { width: 100, height: 28 },
    lg: { width: 140, height: 38 },
    xl: { width: 180, height: 50 },
};

export function Logo({ size = 'md' }: LogoProps) {
    const { width, height } = sizeMap[size];

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 180 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
        >
            <defs>
                <linearGradient id="zGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8A2BE2" />
                    <stop offset="100%" stopColor="#00FFFF" />
                </linearGradient>
            </defs>

            {/* ZZELIX wordmark */}
            <text
                x="0"
                y="36"
                fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
                fontSize="38"
                fontWeight="800"
                letterSpacing="-1"
                fill="url(#zGradient)"
            >
                ZZELIX
            </text>
        </svg>
    );
}
