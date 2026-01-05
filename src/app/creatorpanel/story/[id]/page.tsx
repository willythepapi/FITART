'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Save, Eye, Settings, Check, AlertCircle, Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreatorStore } from '@/store/creatorStore';
import { BlueprintCanvas } from '@/components/creator/BlueprintCanvas';
import { BlueprintNodeData } from '@/components/creator/BlueprintNode';
import { NodePropertiesPanel } from '@/components/creator/NodePropertiesPanel';
import { StoryPreviewModal } from '@/components/creator/StoryPreviewModal';
import { PublishModal } from '@/components/creator/PublishModal';
import { CreatorStory } from '@/types/creatorTypes';

interface StoryEditorProps {
    params: Promise<{ id: string }>;
}

// Connection type for the blueprint
interface Connection {
    id: string;
    fromId: string;
    toId: string;
    fromOutput?: number;
}

// Story Settings Modal
function StorySettingsModal({
    story,
    onClose,
    onSave
}: {
    story: CreatorStory;
    onClose: () => void;
    onSave: (updates: Partial<CreatorStory>) => void;
}) {
    const [form, setForm] = useState({
        title: story.title,
        description: story.description,
        category: story.category,
        rating: story.rating,
    });
    const [posters, setPosters] = useState(story.posters);

    const categories = [
        { value: 'romance', label: 'Romantik' },
        { value: 'mystery', label: 'Gizem' },
        { value: 'sci-fi', label: 'Bilim Kurgu' },
        { value: 'fantasy', label: 'Fantastik' },
        { value: 'horror', label: 'Korku' },
        { value: 'drama', label: 'Drama' },
        { value: 'comedy', label: 'Komedi' },
        { value: 'action', label: 'Aksiyon' },
        { value: 'slice-of-life', label: 'Günlük Yaşam' },
    ];

    return (
        <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-[#1a1a1a] rounded-xl w-full max-w-lg p-6 border border-white/10"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Settings className="size-5" />
                    Hikaye Ayarları
                </h2>

                <div className="space-y-4">
                    {/* Posters */}
                    <div>
                        <label className="block text-xs text-gray-500 mb-2">Posterler</label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['thumbnail', 'banner', 'portrait'] as const).map((type) => (
                                <div key={type}>
                                    <span className="text-[10px] text-gray-500 block mb-1">
                                        {type === 'thumbnail' ? 'Kart' : type === 'banner' ? 'Banner' : 'Dikey'}
                                    </span>
                                    {posters[type] ? (
                                        <div className="relative aspect-video rounded bg-black group">
                                            <img src={posters[type]} alt="" className="w-full h-full object-cover rounded" />
                                            <button
                                                onClick={() => setPosters({ ...posters, [type]: '' })}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400"
                                            >
                                                Kaldır
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="block aspect-video rounded border border-dashed border-white/20 hover:border-purple/50 cursor-pointer text-center flex items-center justify-center text-[10px] text-gray-500">
                                            Yükle
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                if (e.target.files?.[0]) setPosters({ ...posters, [type]: URL.createObjectURL(e.target.files[0]) });
                                            }} />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="Hikaye Adı"
                        className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-purple focus:outline-none"
                    />
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Kısa Açıklama"
                        className="w-full bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-purple focus:outline-none"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value as CreatorStory['category'] })}
                            className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                        >
                            {categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                        </select>
                        <select
                            value={form.rating}
                            onChange={(e) => setForm({ ...form, rating: e.target.value as CreatorStory['rating'] })}
                            className="bg-[#222] border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                        >
                            <option value="everyone">Herkes İçin</option>
                            <option value="teen">13+</option>
                            <option value="mature">18+</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">
                        İptal
                    </button>
                    <button
                        onClick={() => { onSave({ ...form, posters }); onClose(); }}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple to-cyan text-white font-medium"
                    >
                        Kaydet
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function StoryEditorPage({ params }: StoryEditorProps) {
    const { id } = use(params);
    const router = useRouter();
    const { stories, setCurrentStory, currentStory, updateStory, hasUnsavedChanges, saveChanges } = useCreatorStore();

    // Blueprint state
    const [nodes, setNodes] = useState<BlueprintNodeData[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const [showSettings, setShowSettings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showPublish, setShowPublish] = useState(false);
    const [saved, setSaved] = useState(false);

    // Initialize story and load blueprint
    useEffect(() => {
        if (id) {
            setCurrentStory(id);
        }
        const foundStory = stories.find(s => s.id === id);

        // Load existing blueprint if available, otherwise default
        if (foundStory) {
            const chapter = foundStory.chapters[0]; // Assuming single chapter for now
            if (chapter?.blueprint) {
                setNodes(chapter.blueprint.nodes);
                setConnections(chapter.blueprint.connections);
                setSaved(true);
            } else if (nodes.length === 0) {
                setNodes([{
                    id: 'start_node',
                    type: 'start',
                    title: 'Başlangıç',
                    x: 100,
                    y: 200,
                }]);
            }
        }
    }, [id, setCurrentStory, stories]); // Removed nodes.length dependency to avoid reset loops

    // Fix: Determine story from list for local use if needed, but currentStory is better
    // Safety check mostly for type narrowing below
    if (!currentStory) {
        return null; // Or loading state
    }

    return (
        <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-white/10 bg-[#111] flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/creatorpanel')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-white flex items-center gap-2">
                            {currentStory.title}
                            {currentStory.status === 'published' && <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px]">YAYINDA</span>}
                            {currentStory.status === 'scheduled' && <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px]">PLANLANDI</span>}
                            {currentStory.status === 'draft' && <span className="px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400 text-[10px]">TASLAK</span>}
                        </h1>
                        <span className="text-xs text-gray-500">
                            {hasUnsavedChanges ? 'Kaydedilmemiş değişiklikler...' : 'Son değişiklikler kaydedildi'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Hikaye Ayarları"
                    >
                        <Settings className="size-5" />
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    <button
                        onClick={() => {
                            // Serialize Graph to Scenes logic
                            const serializeGraph = () => {
                                const sceneNodes = nodes.filter(n => n.type === 'scene');
                                const startConn = connections.find(c => nodes.find(n => n.id === c.fromId)?.type === 'start');
                                const firstSceneId = startConn ? startConn.toId : sceneNodes[0]?.id;

                                const serializedScenes = sceneNodes.map(node => {
                                    /* Maps standard properties */
                                    const nextConn = connections.find(c => c.fromId === node.id);
                                    let nextSceneId = undefined;
                                    let choices = undefined;

                                    if (nextConn) {
                                        const target = nodes.find(n => n.id === nextConn.toId);
                                        if (target?.type === 'scene' || target?.type === 'end') nextSceneId = target.id;
                                        else if (target?.type === 'choice') {
                                            choices = target.data?.choices?.map((ch, idx) => {
                                                const chConn = connections.find(c => c.fromId === target.id && c.fromOutput === idx);
                                                return { id: ch.id, text: ch.text, nextSceneId: chConn?.toId || '' };
                                            });
                                        }
                                    }

                                    return {
                                        id: node.id,
                                        order: node.id === firstSceneId ? 0 : 1, // Simple ordering, priority to start
                                        backgroundImage: node.data?.backgroundImage || '',
                                        audio: { voiceover: node.data?.voiceover || '' },
                                        dialog: { text: node.data?.dialogText || '', speaker: node.data?.speaker || 'Narrator' },
                                        nextSceneId,
                                        choices
                                    };
                                });
                                // Reorder to put first scene at index 0
                                if (firstSceneId) {
                                    const firstIdx = serializedScenes.findIndex(s => s.id === firstSceneId);
                                    if (firstIdx > 0) {
                                        const [first] = serializedScenes.splice(firstIdx, 1);
                                        serializedScenes.unshift(first);
                                    }
                                }
                                return serializedScenes;
                            };

                            const scenes = serializeGraph();
                            const currentChapter = currentStory.chapters[0] || { id: 'default', title: 'Chapter 1', order: 1, scenes: [] };

                            // Save Blueprint (Editor State) AND Scenes (Game State)
                            const updatedChapter = {
                                ...currentChapter,
                                scenes,
                                blueprint: { nodes, connections }
                            };

                            updateStory(currentStory.id, {
                                chapters: [updatedChapter] // Replace simple chapter list
                            });

                            saveChanges();
                            setSaved(true);
                            setTimeout(() => setSaved(false), 2000);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-colors"
                    >
                        <Save className="size-4" />
                        {saved ? 'Kaydedildi!' : 'Kaydet'}
                    </button>


                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple/10 hover:bg-purple/20 border border-purple/30 text-purple-300 rounded-lg text-xs font-medium transition-colors"
                    >
                        <Play className="size-4" />
                        Önizle
                    </button>

                    <button
                        onClick={() => setShowPublish(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple to-cyan text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                        Yayınla
                    </button>
                </div>
            </header>

            {/* Editor Canvas Area */}
            <div className="flex-1 relative overflow-hidden flex">
                <div className="flex-1 relative h-full">
                    <BlueprintCanvas
                        nodes={nodes}
                        connections={connections}
                        selectedNodeId={selectedNodeId}
                        onNodesChange={setNodes}
                        onConnectionsChange={setConnections}
                        onSelectNode={setSelectedNodeId}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {selectedNodeId && (
                        <NodePropertiesPanel
                            node={nodes.find(n => n.id === selectedNodeId) || null}
                            onUpdate={(updates) => {
                                setNodes(nodes.map(n => n.id === selectedNodeId ? { ...n, ...updates } : n));
                            }}
                            onClose={() => setSelectedNodeId(null)}
                        />
                    )}
                </AnimatePresence>
            </div>            <AnimatePresence>
                {showSettings && (
                    <StorySettingsModal
                        story={currentStory}
                        onClose={() => setShowSettings(false)}
                        onSave={(updates) => updateStory(currentStory.id, updates)}
                    />
                )}
                {showPreview && (
                    <StoryPreviewModal
                        nodes={nodes}
                        connections={connections}
                        onClose={() => setShowPreview(false)}
                    />
                )}
                {showPublish && (
                    <PublishModal
                        storyId={currentStory.id}
                        onClose={() => setShowPublish(false)}
                    />
                )}
            </AnimatePresence>
        </div >
    );
}
