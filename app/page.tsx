"use client"; 

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import VibeForecast from "@/components/VibeForecast";
import VibeCard, { CardProps } from "@/components/VibeCard";
import CreateVibeModal from "@/components/CreateVibeModal";
import { Plus, Zap, Shuffle, Clock, Flame, Snowflake, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useVibe } from "@/context/VibeProvider"; // 🌟 引入 Auth

const NOW = Date.now();
const HOUR = 3600 * 1000;

const INITIAL_CARDS: CardProps[] = [
  { id: 1, title: 'Neon Nights in Tokyo', content: 'Just finished my cyberpunk setup. The vibes are immaculate tonight.', image: 'https://picsum.photos/seed/88/400/600', author: 'NeonDrifter', avatar: 'https://i.pravatar.cc/150?u=1', initialBoost: 85, initialChill: 12, timestamp: NOW - 2 * HOUR, visibility: 'public' },
  { id: 2, title: 'Frozen Solitude', content: 'Sometimes you just need to stare at the rain and feel nothing.', image: 'https://picsum.photos/seed/24/400/600', author: 'IceQueen', avatar: 'https://i.pravatar.cc/150?u=2', initialBoost: 5, initialChill: 90, timestamp: NOW - 5 * HOUR, visibility: 'public' },
  { id: 3, title: 'Monday Morning Chaos', content: 'Coffee spilled, code broke, but we move.', image: 'https://picsum.photos/seed/12/400/600', author: 'DevLife', avatar: 'https://i.pravatar.cc/150?u=3', initialBoost: 45, initialChill: 20, timestamp: NOW - 12 * HOUR, visibility: 'public' },
  { id: 4, title: 'Late Night Thoughts', content: 'Why is the night sky so heavy today?', image: 'https://picsum.photos/seed/99/400/600', author: 'SilentEcho', avatar: 'https://i.pravatar.cc/150?u=5', initialBoost: 10, initialChill: 35, timestamp: NOW - 1 * HOUR, visibility: 'public' },
  { id: 5, title: 'Code, Coffee, Repeat', content: 'Finally fixed that bug after 5 hours. The dopamine hit is real.', image: 'https://picsum.photos/seed/41/400/600', author: 'TechMonk', avatar: 'https://i.pravatar.cc/150?u=6', initialBoost: 15, initialChill: 5, timestamp: NOW - 3 * HOUR, visibility: 'public' },
];

type FilterType = 'random' | 'latest' | 'fire' | 'ice';

export default function Home() {
  const [cards, setCards] = useState<CardProps[]>(INITIAL_CARDS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pointsAnimation, setPointsAnimation] = useState<{show: boolean, amount: number}>({show: false, amount: 0});
  const [filter, setFilter] = useState<FilterType>('latest');
  
  // 🌟 Auth & Toast State
  const { isLoggedIn, user, addPoints } = useVibe(); 
  const [toast, setToast] = useState<string | null>(null);

  // 🌟 点击发布按钮的拦截逻辑
  const handleCreateClick = () => {
    if (!isLoggedIn) {
        setToast("Please Login to Emit Vibes.");
        setTimeout(() => setToast(null), 2000);
        return;
    }
    setShowCreateModal(true);
  };

  const handlePublish = (newData: { title: string; content: string; image: string, visibility: 'public' | 'private' }) => {
    if (!user) return;
    
    const newCard: CardProps = {
      id: Date.now(), 
      title: newData.title,
      content: newData.content,
      image: newData.image,
      author: user.username, // 🌟 使用真实用户名
      avatar: user.avatar,   // 🌟 使用真实头像
      initialBoost: 0,
      initialChill: 0,
      timestamp: Date.now(),
      visibility: newData.visibility
    };

    if (newData.visibility === 'public') {
        setCards(prev => [newCard, ...prev]);
    }
    
    setFilter('latest');
    addPoints(50); // 🌟 增加全局积分
    triggerPointsAnimation(50);
  };

  const triggerPointsAnimation = (amount: number) => {
    setPointsAnimation({ show: true, amount });
    setTimeout(() => setPointsAnimation({ show: false, amount: 0 }), 2000);
  };

  const sortedCards = useMemo(() => {
    const list = [...cards];
    switch (filter) {
      case 'latest': return list.sort((a, b) => b.timestamp - a.timestamp);
      case 'fire': return list.sort((a, b) => b.initialBoost - a.initialBoost);
      case 'ice': return list.sort((a, b) => b.initialChill - a.initialChill);
      case 'random': return list.sort(() => Math.random() - 0.5);
      default: return list;
    }
  }, [cards, filter]);

  const FilterButton = ({ type, label, icon: Icon, activeColorClass }: any) => (
    <button
      onClick={() => setFilter(type)}
      className={clsx(
        "px-5 py-2 rounded-full text-sm font-bold border transition-all flex items-center gap-2",
        filter === type ? `bg-white/10 text-white ${activeColorClass} shadow-lg` : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon size={14} /> {label}
    </button>
  );

  return (
    <main className="min-h-screen flex flex-col pt-24">
      <Navbar />
      <VibeForecast />

      <div className="w-full max-w-7xl mx-auto px-6 mb-6 flex gap-3 overflow-x-auto no-scrollbar pb-2">
        <FilterButton type="random" label="Random" icon={Shuffle} activeColorClass="border-white" />
        <FilterButton type="latest" label="Latest" icon={Clock} activeColorClass="border-white" />
        <FilterButton type="fire" label="Top Fire" icon={Flame} activeColorClass="border-vibe-fire text-vibe-fire" />
        <FilterButton type="ice" label="Top Ice" icon={Snowflake} activeColorClass="border-vibe-ice text-vibe-ice" />
      </div>

      <div className="flex-grow w-full max-w-7xl mx-auto px-6 pb-20">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedCards.map((card) => (
              <motion.div 
                key={card.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
              >
                <VibeCard data={card} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* FAB with Auth Check */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={handleCreateClick}
          className="w-14 h-14 rounded-full bg-vibe-fire text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-white/20"
        >
          <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      <AnimatePresence>
        {showCreateModal && <CreateVibeModal onClose={() => setShowCreateModal(false)} onPublish={handlePublish} />}
      </AnimatePresence>

      <AnimatePresence>
        {pointsAnimation.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(234,179,8,0.6)]"
          >
            <Zap size={20} fill="currentColor" /> <span>Daily First Post: +{pointsAnimation.amount} PTS</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 Global Toast for Auth Warning */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-md text-red-400 font-bold text-sm flex items-center gap-2"
          >
            <AlertTriangle size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}