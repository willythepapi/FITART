'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Rocket, AlertCircle } from 'lucide-react';
import { useCreatorStore } from '@/store/creatorStore';

interface PublishModalProps {
    storyId: string;
    onClose: () => void;
}

export function PublishModal({ storyId, onClose }: PublishModalProps) {
    const updateStory = useCreatorStore(state => state.updateStory);
    const story = useCreatorStore(state => state.stories.find(s => s.id === storyId));

    const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [isConfirming, setIsConfirming] = useState(false);

    if (!story) return null;

    const handlePublish = () => {
        const publishDate = publishMode === 'now' ? new Date() : new Date(scheduledDate);

        // Validation for schedule
        if (publishMode === 'schedule') {
            if (!scheduledDate) return; // Add error handling UI if needed
            if (publishDate <= new Date()) {
                // Warning logic if needed
            }
        }

        const status = publishDate > new Date() ? 'scheduled' : 'published';

        updateStory(storyId, {
            status,
            publishDate: publishDate,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple/10 to-transparent">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Rocket className="size-5 text-purple" />
                        Yayına Al
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="size-5 text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-purple/5 border border-purple/20 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="size-5 text-purple shrink-0" />
                        <div className="text-sm text-purple-200/80">
                            <span className="font-semibold text-purple-300">"{story.title}"</span> adlı hikayeyi yayınlamak üzeresiniz. Yayına alındıktan sonra izleyiciler hikayenize erişebilir.
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPublishMode('now')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${publishMode === 'now'
                                    ? 'bg-purple/20 border-purple text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Rocket className="size-6" />
                            <span className="font-medium text-sm">Hemen Yayınla</span>
                        </button>

                        <button
                            onClick={() => setPublishMode('schedule')}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${publishMode === 'schedule'
                                    ? 'bg-cyan/20 border-cyan text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Calendar className="size-6" />
                            <span className="font-medium text-sm">İleri Tarihli</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {publishMode === 'schedule' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Yayın Tarihi ve Saati</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            value={scheduledDate}
                                            onChange={(e) => setScheduledDate(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors appearance-none"
                                            // Ensure icon visibility in dark mode via css or custom style if needed
                                            style={{ colorScheme: 'dark' }}
                                        />
                                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Seçilen tarihte hikaye otomatik olarak "Yeni" etiketiyle yayına girecek.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-[#151515]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={publishMode === 'schedule' && !scheduledDate}
                        className="px-6 py-2 bg-gradient-to-r from-purple to-purple-dark hover:from-purple-light hover:to-purple rounded-lg text-white text-sm font-bold shadow-lg shadow-purple/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {publishMode === 'now' ? 'Yayınla' : 'Planla'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
