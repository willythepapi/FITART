'use client';

import { motion } from 'framer-motion';
import {
    Play, Image as ImageIcon, GitBranch, Flag,
    MoreVertical, Trash2, Copy
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Re-export type if needed, or import from a shared types file
export type NodeType = 'start' | 'scene' | 'choice' | 'end';

// Basic types for localization
export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr';
export type LocalizedString = { [key in Language]?: string };

export interface BlueprintNodeData {
    id: string;
    type: NodeType;
    title: string;
    x: number;
    y: number;
    outputs?: string[];
    data?: {
        backgroundImage?: string;
        voiceover?: LocalizedString; // Changed to LocalizedString
        dialogText?: LocalizedString; // Changed to LocalizedString
        speaker?: string;
        choices?: { id: string; text: LocalizedString; targetId?: string }[]; // Changed text to LocalizedString
    };
}

interface BlueprintNodeProps {
    node: BlueprintNodeData;
    isSelected: boolean;
    onSelect: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onDelete: () => void;
    onConnectStart: (e: React.MouseEvent, outputIndex?: number) => void;
    onConnectEnd: () => void;
}

const nodeColors: Record<NodeType, { bg: string; border: string; icon: string; shadow: string }> = {
    start: {
        bg: 'bg-[#0f1d15]/90',
        border: 'border-green-500/50',
        icon: 'text-green-400',
        shadow: 'shadow-[0_0_30px_-10px_rgba(74,222,128,0.3)]'
    },
    scene: {
        bg: 'bg-[#150f1d]/90',
        border: 'border-purple-500/50',
        icon: 'text-purple-400',
        shadow: 'shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]'
    },
    choice: {
        bg: 'bg-[#1d140f]/90',
        border: 'border-orange-500/50',
        icon: 'text-orange-400',
        shadow: 'shadow-[0_0_30px_-10px_rgba(251,146,60,0.3)]'
    },
    end: {
        bg: 'bg-[#1d0f0f]/90',
        border: 'border-red-500/50',
        icon: 'text-red-400',
        shadow: 'shadow-[0_0_30px_-10px_rgba(248,113,113,0.3)]'
    },
};

const nodeIcons: Record<NodeType, React.ReactNode> = {
    start: <Play className="size-3.5 fill-current" />,
    scene: <ImageIcon className="size-3.5" />,
    choice: <GitBranch className="size-3.5" />,
    end: <Flag className="size-3.5 fill-current" />,
};

const nodeLabels: Record<NodeType, string> = {
    start: 'Başlangıç',
    scene: 'Sahne',
    choice: 'Seçim',
    end: 'Son',
};

export function BlueprintNode({
    node,
    isSelected,
    onSelect,
    onMouseDown,
    onDelete,
    onConnectStart,
    onConnectEnd
}: BlueprintNodeProps) {
    const [showMenu, setShowMenu] = useState(false);
    const colors = nodeColors[node.type];
    const nodeRef = useRef<HTMLDivElement>(null);

    const completion = (() => {
        if (node.type !== 'scene' || !node.data) return null;
        let complete = 0;
        if (node.data.backgroundImage) complete++;
        if (node.data.voiceover) complete++;
        if (node.data.dialogText) complete++;
        return { complete, total: 3 };
    })();

    return (
        <div
            ref={nodeRef}
            className="absolute select-none group focus:outline-none"
            style={{
                left: node.x,
                top: node.y,
                zIndex: isSelected ? 50 : 10,
            }}
            onMouseDown={onMouseDown}
        >
            <div
                className={`
          relative w-48 rounded-xl border backdrop-blur-xl transition-all duration-200
          ${colors.bg} ${colors.border}
          ${isSelected
                        ? `ring-1 ring-white/50 scale-[1.02] ${colors.shadow}`
                        : 'hover:border-white/20 hover:shadow-lg shadow-black/50'}
        `}
            >
                {/* Header - Glassy look */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5 bg-white/5 rounded-t-xl">
                    <div className={`p-1 rounded-md bg-black/40 ${colors.icon} shadow-inner`}>
                        {nodeIcons[node.type]}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-white/50 uppercase">{nodeLabels[node.type]}</span>

                    {node.type !== 'start' && (
                        <button
                            className="ml-auto p-1 text-white/20 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <MoreVertical className="size-3" />
                        </button>
                    )}

                    {/* Menu */}
                    {showMenu && (
                        <div className="absolute top-8 right-2 bg-[#1a1a1a] border border-white/10 rounded-lg py-1 z-50 shadow-2xl w-32 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                    setShowMenu(false);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <Trash2 className="size-3" /> Sil
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="px-3 py-3 min-h-[60px]">
                    <p className="text-sm text-white/90 font-medium truncate leading-tight">{node.title}</p>

                    {/* Scene Preview */}
                    {node.type === 'scene' && node.data?.backgroundImage && (
                        <div className="mt-3 aspect-video rounded-md overflow-hidden bg-black/50 ring-1 ring-white/10 shadow-inner">
                            <img
                                src={node.data.backgroundImage}
                                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                                draggable={false}
                            />
                        </div>
                    )}

                    {/* Choices Preview */}
                    {node.type === 'choice' && node.data?.choices && (
                        <div className="mt-3 space-y-1.5">
                            {node.data.choices.slice(0, 3).map((choice, i) => {
                                const text = typeof choice.text === 'string'
                                    ? choice.text
                                    : (choice.text?.tr || choice.text?.en || '');
                                return (
                                    <div key={choice.id} className="text-[10px] text-gray-400 truncate flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5">
                                        <span className="text-orange-400/80 font-mono">{i + 1}.</span>
                                        <span className="opacity-80">{text || 'Seçenek...'}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Completion Status */}
                    {completion && (
                        <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                            <span className="text-[9px] text-gray-500 font-medium">DURUM</span>
                            <div className="flex-1 h-1 bg-black/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${completion.complete === completion.total ? 'bg-green-500' : 'bg-purple'}`}
                                    style={{ width: `${(completion.complete / completion.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* --- CONNECTOR POINTS (PORTS) --- */}

                {/* INPUT (Left) */}
                {node.type !== 'start' && (
                    <div
                        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 group p-2 cursor-crosshair z-20"
                        onMouseUp={(e) => {
                            e.stopPropagation();
                            onConnectEnd();
                        }}
                    >
                        {/* Port Visual */}
                        <div className="w-3.5 h-3.5 rounded-full bg-[#111] border-[2px] border-gray-500 group-hover:border-white group-hover:scale-125 transition-all shadow-lg ring-2 ring-black/50" />
                    </div>
                )}

                {/* OUTPUT (Right) - Standard */}
                {node.type !== 'end' && node.type !== 'choice' && (
                    <div
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 group p-2 cursor-crosshair z-20"
                        onMouseDown={(e) => onConnectStart(e)}
                    >
                        <div className={`w-3.5 h-3.5 rounded-full bg-[#111] border-[2px] ${colors.border} group-hover:bg-white group-hover:scale-125 transition-all shadow-lg ring-2 ring-black/50`} />
                    </div>
                )}

                {/* OUTPUTS - Multiple (for Choice) */}
                {node.type === 'choice' && node.data?.choices && (
                    <>
                        {node.data.choices.map((_, i) => (
                            <div
                                key={i}
                                className="absolute right-0 translate-x-1/2 group p-1.5 cursor-crosshair z-20"
                                style={{ top: `${30 + i * 20}%` }}
                                onMouseDown={(e) => onConnectStart(e, i)}
                            >
                                <div className="w-3 h-3 rounded-full bg-[#111] border-[2px] border-orange-500 group-hover:bg-white group-hover:scale-125 transition-all shadow-lg ring-1 ring-black/50" />
                            </div>
                        ))}
                    </>
                )}

            </div>
        </div>
    );
}
