'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, MoreVertical, Film, Layers, Clock } from 'lucide-react';
import { useCreatorStore } from '@/store/creatorStore';
import { useRouter } from 'next/navigation';
import { NewStoryForm, CreatorStory } from '@/types/creatorTypes';

// Yeni hikaye oluşturma modalı
function CreateStoryModal({ onClose, onCreate }: { onClose: () => void; onCreate: (form: NewStoryForm) => void }) {
    const [form, setForm] = useState<NewStoryForm>({
        title: '',
        description: '',
        synopsis: '',
        category: 'romance',
        rating: 'teen',
    });

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

    const ratings = [
        { value: 'everyone', label: 'Herkes İçin' },
        { value: 'teen', label: '13+ (Genç)' },
        { value: 'mature', label: '18+ (Yetişkin)' },
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4">Yeni Hikaye Oluştur</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Hikaye Adı *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple focus:outline-none"
                            placeholder="Örn: Yıldızların Altında"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Kısa Açıklama *</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple focus:outline-none"
                            placeholder="Kart üzerinde görünecek kısa açıklama"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Özet</label>
                        <textarea
                            value={form.synopsis}
                            onChange={(e) => setForm({ ...form, synopsis: e.target.value })}
                            rows={3}
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple focus:outline-none resize-none"
                            placeholder="Hikayenin detaylı özeti..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Kategori *</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value as CreatorStory['category'] })}
                                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple focus:outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Yaş Sınırı *</label>
                            <select
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: e.target.value as CreatorStory['rating'] })}
                                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple focus:outline-none"
                            >
                                {ratings.map((r) => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={() => {
                            if (form.title && form.description) {
                                onCreate(form);
                                onClose();
                            }
                        }}
                        disabled={!form.title || !form.description}
                        className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple to-cyan text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Oluştur
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// Hikaye kartı
function StoryCard({ story, onEdit, onDelete }: { story: CreatorStory; onEdit: () => void; onDelete: () => void }) {
    const [showMenu, setShowMenu] = useState(false);
    const sceneCount = story.chapters.reduce((acc, ch) => acc + ch.scenes.length, 0);

    const statusColors = {
        draft: 'bg-yellow-500/20 text-yellow-400',
        review: 'bg-blue-500/20 text-blue-400',
        published: 'bg-green-500/20 text-green-400',
    };

    const statusLabels = {
        draft: 'Taslak',
        review: 'İncelemede',
        published: 'Yayında',
    };

    return (
        <motion.div
            className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-purple/30 transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-purple/30 to-cyan/20">
                {story.posters.thumbnail ? (
                    <img src={story.posters.thumbnail} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Film className="size-12 text-white/20" />
                    </div>
                )}

                {/* Status badge */}
                <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${statusColors[story.status]}`}>
                    {statusLabels[story.status]}
                </div>

                {/* Menu */}
                <div className="absolute top-2 right-2">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="size-4" />
                    </button>

                    <AnimatePresence>
                        {showMenu && (
                            <motion.div
                                className="absolute top-8 right-0 bg-[#2a2a2a] rounded-lg border border-white/10 py-1 min-w-[120px] shadow-xl z-10"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <button
                                    onClick={() => { onEdit(); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10 flex items-center gap-2"
                                >
                                    <Edit className="size-4" /> Düzenle
                                </button>
                                <button
                                    onClick={() => { onDelete(); setShowMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                                >
                                    <Trash2 className="size-4" /> Sil
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="text-white font-semibold mb-1 truncate">{story.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">{story.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Layers className="size-3.5" />
                        {story.chapters.length} Bölüm
                    </span>
                    <span className="flex items-center gap-1">
                        <Film className="size-3.5" />
                        {sceneCount} Sahne
                    </span>
                </div>

                <button
                    onClick={onEdit}
                    className="w-full mt-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Edit className="size-4" />
                    Düzenle
                </button>
            </div>
        </motion.div>
    );
}

export default function CreatorPanelPage() {
    const router = useRouter();
    const { stories, createStory, deleteStory } = useCreatorStore();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreate = (form: NewStoryForm) => {
        const id = createStory(form);
        router.push(`/creatorpanel/story/${id}`);
    };

    const handleEdit = (storyId: string) => {
        router.push(`/creatorpanel/story/${storyId}`);
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/zzelixlogo.png" alt="Zzelix" className="h-6" />
                        <span className="text-white/40">|</span>
                        <h1 className="text-white font-semibold">Creator Panel</h1>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple to-cyan text-white font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="size-5" />
                        Yeni Hikaye
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {stories.length === 0 ? (
                    // Empty state
                    <motion.div
                        className="flex flex-col items-center justify-center py-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple/20 to-cyan/20 flex items-center justify-center mb-6">
                            <Film className="size-12 text-purple" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Henüz hikaye yok</h2>
                        <p className="text-gray-400 text-center mb-6 max-w-sm">
                            İlk hikayenizi oluşturun ve izleyicileriniz için eşsiz bir deneyim yaratın.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple to-cyan text-white font-medium hover:opacity-90 transition-opacity"
                        >
                            <Plus className="size-5" />
                            İlk Hikayeni Oluştur
                        </button>
                    </motion.div>
                ) : (
                    // Story grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stories.map((story) => (
                            <StoryCard
                                key={story.id}
                                story={story}
                                onEdit={() => handleEdit(story.id)}
                                onDelete={() => deleteStory(story.id)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateStoryModal
                        onClose={() => setShowCreateModal(false)}
                        onCreate={handleCreate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
