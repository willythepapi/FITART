'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { BlueprintNodeData } from './BlueprintNode';

interface MapProps {
    nodes: BlueprintNodeData[];
    canvasOffset: { x: number; y: number };
    canvasScale: number;
    viewportSize: { width: number; height: number };
    onNavigate: (x: number, y: number) => void;
}

export function Minimap({ nodes, canvasOffset, canvasScale, viewportSize, onNavigate }: MapProps) {
    // Calculate bounding box of all nodes
    const bounds = useMemo(() => {
        if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 };

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        nodes.forEach(n => {
            minX = Math.min(minX, n.x);
            minY = Math.min(minY, n.y);
            maxX = Math.max(maxX, n.x + 200); // approx width
            maxY = Math.max(maxY, n.y + 150); // approx height
        });

        // Add padding
        const padding = 500;
        minX -= padding;
        minY -= padding;
        maxX += padding;
        maxY += padding;

        return {
            minX, minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }, [nodes]);

    // Minimap dimensions
    const mapWidth = 200;
    const mapHeight = 150;

    // Scale factor from world to map
    const scaleX = mapWidth / bounds.width;
    const scaleY = mapHeight / bounds.height;
    const scale = Math.min(scaleX, scaleY);

    // Viewport rect on map
    // canvasOffset (x,y) is the translation applied to world.
    // Viewport sees ( -offset.x/scale, -offset.y/scale ) to ( +width/scale, +height/scale ) ?
    // Actually transform is: translate(x, y) scale(s)
    // So a point P in world maps to P*s + t in screen.
    // We want to verify which world area is visible:
    // Visible World X = (-offset.x) / canvasScale

    const viewportRect = {
        x: (-canvasOffset.x / canvasScale - bounds.minX) * scale,
        y: (-canvasOffset.y / canvasScale - bounds.minY) * scale,
        w: (viewportSize.width / canvasScale) * scale,
        h: (viewportSize.height / canvasScale) * scale
    };

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'start': return '#22c55e';
            case 'end': return '#ef4444';
            case 'choice': return '#f97316';
            default: return '#a855f7';
        }
    };

    return (
        <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden relative shadow-xl w-[200px] h-[150px]">
            {/* Nodes */}
            {nodes.map(node => (
                <div
                    key={node.id}
                    className="absolute rounded-sm"
                    style={{
                        left: (node.x - bounds.minX) * scale,
                        top: (node.y - bounds.minY) * scale,
                        width: 192 * scale, // node width
                        height: 100 * scale, // approx height
                        backgroundColor: getNodeColor(node.type),
                        opacity: 0.6
                    }}
                />
            ))}

            {/* Viewport Indicator */}
            <div
                className="absolute border-2 border-white/50 bg-white/5 pointer-events-none"
                style={{
                    left: viewportRect.x,
                    top: viewportRect.y,
                    width: viewportRect.w,
                    height: viewportRect.h,
                }}
            />

            {/* Click to navigate could be implemented here */}
        </div>
    );
}
