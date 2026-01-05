'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, RotateCcw } from 'lucide-react';
import { BlueprintNodeData } from './BlueprintNode';

interface Connection {
    id: string;
    fromId: string;
    toId: string;
    fromOutput?: number;
}

interface StoryPreviewModalProps {
    nodes: BlueprintNodeData[];
    connections: Connection[];
    onClose: () => void;
}

export function StoryPreviewModal({ nodes, connections, onClose }: StoryPreviewModalProps) {
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(() => {
        return nodes.find(n => n.type === 'start')?.id || null;
    });

    const currentNode = nodes.find(n => n.id === currentNodeId);

    const handleNext = (choiceIndex?: number) => {
        if (!currentNodeId) return;

        // Find connection from this node
        let connection;
        if (typeof choiceIndex === 'number') {
            connection = connections.find(c => c.fromId === currentNodeId && c.fromOutput === choiceIndex);
        } else {
            connection = connections.find(c => c.fromId === currentNodeId);
        }

        if (connection) {
            setCurrentNodeId(connection.toId);
        } else {
            // No connection - end of path
        }
    };

    const restart = () => {
        setCurrentNodeId(nodes.find(n => n.type === 'start')?.id || null);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#111]">
                <h2 className="text-white font-medium flex items-center gap-2">
                    <Play className="size-4 text-purple" />
                    Önizleme Modu
                </h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={restart}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                    >
                        <RotateCcw className="size-4" />
                        Baştan Başla
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="size-6 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                <AnimatePresence mode="wait">
                    {currentNode ? (
                        <motion.div
                            key={currentNode.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="relative w-full h-full max-w-6xl aspect-video bg-[#1a1a1a] shadow-2xl overflow-hidden"
                        >
                            {/* Background */}
                            {currentNode.data?.backgroundImage && (
                                <div className="absolute inset-0">
                                    <img
                                        src={currentNode.data.backgroundImage}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                </div>
                            )}

                            {/* Content Layer */}
                            <div className="absolute inset-0 flex flex-col justify-end p-12">

                                {/* Start Node Info */}
                                {currentNode.type === 'start' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                        <div className="text-center">
                                            <h1 className="text-4xl font-bold text-white mb-4">Hikaye Başlıyor</h1>
                                            <button
                                                onClick={() => handleNext()}
                                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                                            >
                                                Başla
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* End Node Info */}
                                {currentNode.type === 'end' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                                        <div className="text-center">
                                            <h1 className="text-4xl font-bold text-white mb-4">Son</h1>
                                            <p className="text-gray-400 mb-8">Hikayeyi tamamladınız.</p>
                                            <button
                                                onClick={restart}
                                                className="px-6 py-2 border border-white/20 text-white rounded-full hover:bg-white/10"
                                            >
                                                Tekrar Oyna
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Dialog Box */}
                                {(currentNode.type === 'scene' || currentNode.type === 'choice') && (
                                    <div className="max-w-4xl mx-auto w-full">
                                        {(currentNode.data?.speaker || currentNode.data?.dialogText) && (
                                            <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-6">
                                                {currentNode.data.speaker && (
                                                    <div className="text-purple font-bold mb-2 text-lg">
                                                        {currentNode.data.speaker}
                                                    </div>
                                                )}
                                                <div className="text-white text-lg leading-relaxed">
                                                    {currentNode.data.dialogText || "..."}
                                                </div>
                                            </div>
                                        )}

                                        {/* Controls */}
                                        {currentNode.type === 'scene' && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleNext()}
                                                    className="px-6 py-2 bg-gradient-to-r from-purple to-cyan text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                                                >
                                                    Devam Et
                                                </button>
                                            </div>
                                        )}

                                        {/* Choices */}
                                        {currentNode.type === 'choice' && currentNode.data?.choices && (
                                            <div className="grid gap-3">
                                                {currentNode.data.choices.map((choice, i) => (
                                                    <button
                                                        key={choice.id}
                                                        onClick={() => handleNext(i)}
                                                        className="w-full p-4 text-left bg-white/10 hover:bg-purple/20 border border-white/10 hover:border-purple/50 rounded-xl transition-all text-white font-medium"
                                                    >
                                                        {i + 1}. {choice.text}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-white/50">Bağlantı yok veya geçersiz son.</div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
