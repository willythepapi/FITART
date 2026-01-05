'use client';

interface ConnectionLineProps {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    color?: string;
    isActive?: boolean;
    scale?: number;
}

export function ConnectionLine({
    fromX,
    fromY,
    toX,
    toY,
    color = '#8b5cf6', // Violet-500
    isActive = false,
    scale = 1
}: ConnectionLineProps) {
    // Calculate bezier curve control points
    const midX = (fromX + toX) / 2;
    const dx = Math.abs(toX - fromX);
    // Increase curvature for better look
    const controlOffset = Math.max(dx * 0.4, 50);

    const path = `
    M ${fromX * scale} ${fromY * scale}
    C ${(fromX + controlOffset) * scale} ${fromY * scale},
      ${(toX - controlOffset) * scale} ${toY * scale},
      ${toX * scale} ${toY * scale}
  `;

    return (
        <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{ zIndex: 0 }}
        >
            <defs>
                <linearGradient id={`line-gradient-${fromX}-${fromY}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" /> {/* Cyan-500 */}
                </linearGradient>

                <filter id="glow-line">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Shadow/Outline for better visibility on dark bg */}
            <path
                d={path}
                fill="none"
                stroke="#000"
                strokeWidth={5 * scale}
                strokeOpacity={0.5}
                strokeLinecap="round"
            />

            {/* Main line */}
            <path
                d={path}
                fill="none"
                stroke={`url(#line-gradient-${fromX}-${fromY})`}
                strokeWidth={2 * scale}
                strokeLinecap="round"
                filter="url(#glow-line)" // Always glow
                className="opacity-80"
            />

            {/* Moving particle for flow effect */}
            <circle r={2 * scale} fill="white">
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={path}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                />
            </circle>

            {/* End Cap (Dot) */}
            <circle
                cx={toX * scale}
                cy={toY * scale}
                r={3 * scale}
                fill="#06b6d4"
                stroke="#000"
                strokeWidth={1}
            />
            {/* Start Cap (Dot) */}
            <circle
                cx={fromX * scale}
                cy={fromY * scale}
                r={3 * scale}
                fill={color}
                stroke="#000"
                strokeWidth={1}
            />
        </svg>
    );
}

// Temporary connection line while dragging
export function TempConnectionLine({
    fromX,
    fromY,
    toX,
    toY
}: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}) {
    const path = `M ${fromX} ${fromY} L ${toX} ${toY}`;

    return (
        <svg className="absolute inset-0 pointer-events-none overflow-visible z-50">
            <path
                d={path}
                fill="none"
                stroke="white"
                strokeWidth={1.5}
                strokeDasharray="4,4"
                strokeOpacity={0.6}
            />
            <circle cx={toX} cy={toY} r={4} fill="white" className="animate-pulse" />
        </svg>
    );
}
