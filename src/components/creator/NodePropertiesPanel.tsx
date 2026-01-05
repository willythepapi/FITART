'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Image as ImageIcon, Volume2, MessageSquare, Music,
    Upload, Play, Trash2, Plus, Check, Globe
} from 'lucide-react';
import { BlueprintNodeData, NodeType, Language } from './BlueprintNode';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

interface NodePropertiesPanelProps {
    node: BlueprintNodeData | null;
    onUpdate: (updates: Partial<BlueprintNodeData>) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({ node, onUpdate, onClose }: NodePropertiesPanelProps) {
    const [selectedLang, setSelectedLang] = useState<Language>('tr');

    if (!node) return null;

    const handleDataUpdate = (dataUpdates: Record<string, unknown>) => {
        onUpdate({ data: { ...node.data, ...dataUpdates } });
    };

    // Helper to get localized value safely
    const getLocalized = (field: 'dialogText' | 'voiceover', lang: Language = selectedLang) => {
        const val = node.data?.[field];
        if (typeof val === 'string') return val; // Legacy string support
        return val?.[lang] || '';
    };

    // Helper to set localized value
    const setLocalized = (field: 'dialogText' | 'voiceover', value: string) => {
        const current = node.data?.[field];
        const currentObj = typeof current === 'string' ? { tr: current } : (current || {});
        handleDataUpdate({
            [field]: { ...currentObj, [selectedLang]: value }
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="w-80 bg-[#111] border-l border-white/10 flex flex-col h-full"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
            >
                {/* Header */}
                <div className="flex flex-col border-b border-white/10 bg-[#111]">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h3 className="text-white font-medium">Özellikler</h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="size-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="flex px-2 pb-2 gap-1 overflow-x-auto no-scrollbar">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setSelectedLang(lang.code)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${selectedLang === lang.code
                                    ? 'bg-purple/20 text-purple border border-purple/30'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                                    }`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.code.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Node Title */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Başlık</label>
                        <input
                            type="text"
                            value={node.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-purple focus:outline-none"
                        />
                    </div>

                    {/* Scene Properties */}
                    {node.type === 'scene' && (
                        <>
                            {/* Background Image */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon className="size-4 text-purple" />
                                    <span className="text-xs text-gray-400">Görsel</span>
                                </div>
                                {node.data?.backgroundImage ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                        <img
                                            src={node.data.backgroundImage}
                                            alt="Background"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => handleDataUpdate({ backgroundImage: '' })}
                                            className="absolute top-1 right-1 p-1 rounded bg-black/50 hover:bg-red-500/50 text-white"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="block aspect-video rounded-lg border-2 border-dashed border-white/20 hover:border-purple/50 cursor-pointer transition-colors">
                                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                            <Upload className="size-5 mb-1" />
                                            <span className="text-xs">Yükle</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleDataUpdate({ backgroundImage: URL.createObjectURL(file) });
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Voiceover */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Volume2 className="size-4 text-cyan" />
                                    <span className="text-xs text-gray-400">Seslendirme ({selectedLang.toUpperCase()})</span>
                                </div>
                                {getLocalized('voiceover') ? (
                                    <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-2">
                                        <button className="p-1.5 rounded-full bg-cyan/20 text-cyan">
                                            <Play className="size-3" />
                                        </button>
                                        <span className="flex-1 text-xs text-white truncate">audio_{selectedLang}.mp3</span>
                                        <button
                                            onClick={() => setLocalized('voiceover', '')}
                                            className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                                        >
                                            <Trash2 className="size-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="block p-3 rounded-lg border-2 border-dashed border-white/20 hover:border-cyan/50 cursor-pointer text-center">
                                        <Upload className="size-4 mx-auto mb-1 text-gray-500" />
                                        <span className="text-xs text-gray-500">Ses Yükle ({selectedLang.toUpperCase()})</span>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setLocalized('voiceover', URL.createObjectURL(file));
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Dialog */}

                            {/* Dialog */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="size-4 text-green-400" />
                                    <span className="text-xs text-gray-400">Diyalog ({selectedLang.toUpperCase()})</span>
                                </div>
                                <input
                                    type="text"
                                    value={node.data?.speaker || ''}
                                    onChange={(e) => handleDataUpdate({ speaker: e.target.value })}
                                    placeholder="Konuşan"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs mb-2 focus:border-green-400 focus:outline-none"
                                />
                                <textarea
                                    value={getLocalized('dialogText')}
                                    onChange={(e) => setLocalized('dialogText', e.target.value)}
                                    rows={3}
                                    placeholder={`Diyalog metni (${LANGUAGES.find(l => l.code === selectedLang)?.label})...`}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-green-400 focus:outline-none resize-none"
                                />
                            </div>
                        </>
                    )}

                    {/* Choice Properties */}
                    {node.type === 'choice' && node.data?.choices && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">Seçenekler</span>
                                <button
                                    onClick={() => {
                                        const newChoices = [...(node.data?.choices || []), { id: Date.now().toString(), text: '', targetId: '' }];
                                        handleDataUpdate({ choices: newChoices });
                                    }}
                                    className="p-1 hover:bg-purple/20 rounded text-purple"
                                >
                                    <Plus className="size-3" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {node.data.choices.map((choice, index) => (
                                    <div key={choice.id} className="flex items-center gap-2">
                                        <span className="text-orange-400 text-xs font-medium w-4">{index + 1}.</span>
                                        <input
                                            type="text"
                                            value={(typeof choice.text === 'string' ? choice.text : choice.text?.[selectedLang]) || ''}
                                            onChange={(e) => {
                                                const newChoices = node.data!.choices!.map(c => {
                                                    if (c.id !== choice.id) return c;
                                                    const currentText = typeof c.text === 'string' ? { tr: c.text } : (c.text || {});
                                                    return { ...c, text: { ...currentText, [selectedLang]: e.target.value } };
                                                });
                                                handleDataUpdate({ choices: newChoices });
                                            }}
                                            placeholder={`Seçenek (${selectedLang.toUpperCase()})...`}
                                            className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:border-orange-400 focus:outline-none"
                                        />
                                        {node.data.choices.length > 2 && (
                                            <button
                                                onClick={() => {
                                                    const newChoices = node.data!.choices!.filter(c => c.id !== choice.id);
                                                    handleDataUpdate({ choices: newChoices });
                                                }}
                                                className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Start node info */}
                    {node.type === 'start' && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                            <p className="text-xs text-green-400">
                                Bu hikayenin başlangıç noktasıdır. Buradan bağlantı yaparak akışı başlatın.
                            </p>
                        </div>
                    )}

                    {/* End node info */}
                    {node.type === 'end' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                            <p className="text-xs text-red-400">
                                Bu hikayenin bitiş noktasıdır. Kullanıcı bu sahneye ulaştığında hikaye sona erer.
                            </p>
                        </div>
                    )}
                </div>

                {/* Completion status for scene */}
                {node.type === 'scene' && (
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs">
                            {node.data?.backgroundImage && node.data?.voiceover && node.data?.dialogText ? (
                                <>
                                    <Check className="size-4 text-green-400" />
                                    <span className="text-green-400">Tamamlandı</span>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple to-cyan"
                                            style={{
                                                width: `${(
                                                    (node.data?.backgroundImage ? 1 : 0) +
                                                    (node.data?.voiceover ? 1 : 0) +
                                                    (node.data?.dialogText ? 1 : 0)
                                                ) / 3 * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="text-gray-500">
                                        {(node.data?.backgroundImage ? 1 : 0) + (getLocalized('voiceover') ? 1 : 0) + (getLocalized('dialogText') ? 1 : 0)}/3
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
