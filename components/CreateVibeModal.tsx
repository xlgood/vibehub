"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Sparkles, Globe, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface CreateVibeModalProps {
  onClose: () => void;
  // 🌟 修复：这里的类型必须包含 visibility，与 page.tsx 保持一致
  onPublish: (data: { title: string; content: string; image: string; visibility: 'public' | 'private' }) => void;
}

export default function CreateVibeModal({ onClose, onPublish }: CreateVibeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // 🌟 新增：可见性状态
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 随机图片种子
  const [imageSeed, setImageSeed] = useState(Date.now());

  // 禁用背景滚动
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      onPublish({
        title,
        content,
        image: `https://picsum.photos/seed/${imageSeed}/400/600`,
        visibility // 🌟 传递可见性
      });
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-[#151725] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-vibe-fire" size={20} /> Emit New Vibe
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Frequency Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Rain in Tokyo"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:border-vibe-fire focus:ring-1 focus:ring-vibe-fire outline-none transition-all"
              required
              maxLength={40}
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Signal Message</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's resonating with you right now?"
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-gray-600 focus:border-vibe-fire focus:ring-1 focus:ring-vibe-fire outline-none transition-all resize-none"
              required
              maxLength={280}
            />
          </div>

          {/* 🌟 Visibility Selector */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Broadcast Range</label>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setVisibility('public')}
                    className={clsx(
                        "flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-bold",
                        visibility === 'public' 
                            ? "bg-vibe-fire/10 border-vibe-fire text-vibe-fire" 
                            : "bg-black/40 border-white/10 text-gray-500 hover:bg-white/5"
                    )}
                >
                    <Globe size={16} /> Public
                </button>
                <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={clsx(
                        "flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-bold",
                        visibility === 'private' 
                            ? "bg-purple-500/10 border-purple-500 text-purple-400" 
                            : "bg-black/40 border-white/10 text-gray-500 hover:bg-white/5"
                    )}
                >
                    <Lock size={16} /> Private
                </button>
            </div>
          </div>

          {/* Image Preview (Simulated) */}
          <div className="space-y-2">
             <label className="text-xs uppercase font-bold text-gray-500 ml-1">Visual Attachment</label>
             <div className="relative h-32 rounded-xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer" onClick={() => setImageSeed(Date.now())}>
                <img 
                    src={`https://picsum.photos/seed/${imageSeed}/400/200`} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 gap-2 font-bold text-sm bg-black/20 group-hover:bg-transparent transition-colors">
                    <ImageIcon size={18} /> Regenerate Noise
                </div>
             </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-6 pt-2 border-t border-white/5 bg-[#151725]">
          <button 
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-vibe-fire to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> Broadcast Vibe</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}