'use client';

import { X, Keyboard, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export function ShortcutsModal({ onClose }: { onClose: () => void }) {
    const shortcuts = [
        { key: 'Space + Drag', desc: 'Tuvalde Gezinme (Pan)' },
        { key: 'Mouse Wheel', desc: 'Yakınlaştır / Uzaklaştır' },
        { key: 'Delete / Backspace', desc: 'Seçili Öğeyi Sil' },
        { key: 'Ctrl + Scroll', desc: 'Hızlı Zoom' },
        { key: 'Drag from Dot', desc: 'Bağlantı Kur' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Keyboard className="size-5 text-purple" />
                        Klavye Kısayolları
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-gray-400">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    {shortcuts.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                            <span className="text-gray-300 text-sm">{s.desc}</span>
                            <kbd className="px-2 py-1 bg-[#111] border border-white/10 rounded text-xs text-purple font-mono">
                                {s.key}
                            </kbd>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
