"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VibeForecast from "@/components/VibeForecast";
import VibeCard, { CardProps } from "@/components/VibeCard";
import CreateVibeModal from "@/components/CreateVibeModal";
import { Plus, Zap, Shuffle, Clock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useVibe } from "@/context/VibeProvider";
import { getVibes, createVibe } from "@/app/actions"; // 🌟 引入 Actions

export default function Home() {
  const [activeTab, setActiveTab] = useState<'trending' | 'latest'>('trending');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { isLoggedIn, user } = useVibe();

  // 🌟 真实数据状态
  const [vibes, setVibes] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 加载数据
  const loadData = async () => {
    setLoading(true);
    const data = await getVibes(activeTab); // 调用 Server Action
    setVibes(data);
    setLoading(false);
  };

  // 当 Tab 切换或发帖成功时重新加载
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handlePublish = async (newData: { title: string; content: string; image: string; visibility: 'public' | 'private' }) => {
    if (!user) return;
    
    // 调用 Server Action 创建
    await createVibe(user.id, {
        title: newData.title,
        content: newData.content,
        image: newData.image,
        visibility: newData.visibility
    });

    // 重新加载列表
    loadData();
  };

  return (
    <main className="min-h-screen pt-20 pb-20 bg-[#050505]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-8">
          
          {/* Left: Forecast */}
          <div className="flex-1">
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Zap size={14} className="text-vibe-fire" /> Global Energy
             </h2>
             <VibeForecast />
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col gap-4 justify-end md:w-64">
            <button 
              onClick={() => {
                if (isLoggedIn) setShowCreateModal(true);
                else alert("Please login to emit vibes."); 
              }}
              className="w-full py-3 md:py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <Plus size={20} /> Emit Vibe
            </button>
            
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setActiveTab('trending')}
                className={clsx("flex-1 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'trending' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white")}
              >
                <Shuffle size={14} /> <span className="hidden md:inline">Trending</span>
              </button>
              <button 
                onClick={() => setActiveTab('latest')}
                className={clsx("flex-1 py-2 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'latest' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white")}
              >
                <Clock size={14} /> <span className="hidden md:inline">Latest</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feed Grid */}
        {loading ? (
             <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-vibe-fire" size={40} />
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
                {vibes.length > 0 ? (
                    vibes.map((card) => (
                    <motion.div 
                        key={card.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <VibeCard data={card} />
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-500">
                        <p>No vibes detected in the void. Be the first to emit.</p>
                    </div>
                )}
            </AnimatePresence>
            </div>
        )}

      </div>

      <AnimatePresence>
         {showCreateModal && <CreateVibeModal onClose={() => setShowCreateModal(false)} onPublish={handlePublish} />}
      </AnimatePresence>

    </main>
  );
}