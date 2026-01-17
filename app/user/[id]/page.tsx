"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Grid, Flame, Snowflake, MessageCircle, MapPin, Zap, Check, Share2 } from "lucide-react";
import { clsx } from "clsx";
import VibeCard, { CardProps } from "@/components/VibeCard";
import { useVibe } from "@/context/VibeProvider"; // 🌟 引入 Auth

// Mock Data ... (Same as before)
const MOCK_USER = {
  id: "neondrifter",
  username: "NeonDrifter",
  handle: "@neon_drifter",
  bio: "Cyberpunk enthusiast. Creating vibes from the digital rain. 🌧️✨",
  avatar: "https://i.pravatar.cc/150?u=1",
  points: 15420,
  vibeScore: 98,
  faction: "fire",
  location: "Neo Tokyo",
  joined: "Nov 2025"
};

const MOCK_USER_CARDS: CardProps[] = [
  { id: 101, title: 'Secret Project', content: 'Hidden vibe.', image: 'https://picsum.photos/seed/secret/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 0, initialChill: 0, timestamp: Date.now(), visibility: 'private' },
  { id: 102, title: 'Neon Nights', content: 'The city never sleeps.', image: 'https://picsum.photos/seed/88/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 85, initialChill: 12, timestamp: Date.now() - 100000, visibility: 'public' },
  { id: 103, title: 'Coffee Run', content: 'Fuel for the code.', image: 'https://picsum.photos/seed/12/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 45, initialChill: 20, timestamp: Date.now() - 500000, visibility: 'public' },
];

export default function UserProfile() {
  const params = useParams();
  const [isSynced, setIsSynced] = useState(false);
  const { isLoggedIn } = useVibe(); // 🌟

  const publicCards = MOCK_USER_CARDS.filter(c => c.visibility === 'public');

  const handleSync = () => {
    if (!isLoggedIn) {
        alert("Please Login to Sync with users."); // 简单提示
        return;
    }
    setIsSynced(!isSynced);
  };

  const handleShare = async () => {
    const shareData = { title: `Check out ${MOCK_USER.username} on VibeCheck`, url: window.location.href };
    if (navigator.share) { try { await navigator.share(shareData); } catch (err) {} } else { try { await navigator.clipboard.writeText(window.location.href); alert("Profile link copied!"); } catch (err) {} }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        {/* Header ... (Same as before) */}
        <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className={clsx("absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40 transition-colors duration-1000", MOCK_USER.faction === 'fire' ? "bg-vibe-fire" : "bg-vibe-ice")} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className={clsx("w-32 h-32 rounded-full border-4 overflow-hidden bg-black shrink-0 shadow-2xl", MOCK_USER.faction === 'fire' ? "border-vibe-fire/50 shadow-orange-900/50" : "border-vibe-ice/50 shadow-cyan-900/50")}><img src={MOCK_USER.avatar} className="w-full h-full object-cover" /></div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3"><h1 className="text-3xl font-bold text-white">{MOCK_USER.username}</h1><span className={clsx("self-start px-2 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1", MOCK_USER.faction === 'fire' ? "text-vibe-fire border-vibe-fire bg-orange-900/20" : "text-vibe-ice border-vibe-ice bg-cyan-900/20")}>{MOCK_USER.faction === 'fire' ? <Flame size={10} fill="currentColor" /> : <Snowflake size={10} fill="currentColor" />}{MOCK_USER.faction} Faction</span></div>
              <p className="text-sm text-gray-500 font-mono">{MOCK_USER.handle}</p>
              <p className="text-gray-300 max-w-lg leading-relaxed">"{MOCK_USER.bio}"</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-2"><span className="flex items-center gap-1"><MapPin size={12} /> {MOCK_USER.location}</span><span>Joined {MOCK_USER.joined}</span></div>
            </div>
            <div className="flex flex-col gap-4 min-w-[140px]">
               <div className="flex gap-2">
                 <button onClick={handleSync} className={clsx("flex-1 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border shadow-lg", isSynced ? "bg-black/40 border-white/20 text-white" : "bg-gradient-to-r from-purple-600 to-indigo-600 border-transparent text-white hover:scale-105")}>{isSynced ? <Check size={16} /> : <Zap size={16} fill="currentColor" />}{isSynced ? "Synced" : "Sync"}</button>
                 <button onClick={handleShare} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"><Share2 size={18} /></button>
               </div>
               <div className="grid grid-cols-2 gap-2"><div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center"><div className="text-[10px] text-gray-500 uppercase font-bold">Vibe</div><div className={clsx("text-lg font-mono font-bold", MOCK_USER.faction === 'fire' ? "text-vibe-fire" : "text-vibe-ice")}>{MOCK_USER.vibeScore}</div></div><div className="bg-black/30 rounded-xl p-3 border border-white/5 text-center"><div className="text-[10px] text-gray-500 uppercase font-bold">Points</div><div className="text-lg font-mono font-bold text-white">{(MOCK_USER.points / 1000).toFixed(1)}k</div></div></div>
            </div>
          </div>
        </div>
        <div className="flex gap-6 mb-8 border-b border-white/10 pb-1"><button className="pb-3 text-sm font-bold flex items-center gap-2 text-white border-b-2 border-white transition-all"><Grid size={16} /> Public Vibes<span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-gray-300 ml-1">{publicCards.length}</span></button></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicCards.length > 0 ? (
            publicCards.map((card) => (
              <motion.div key={card.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <VibeCard data={card} isOwner={false} disableProfileLink={true} /> 
              </motion.div>
            ))
          ) : (<div className="col-span-3 text-center py-20 text-gray-500 flex flex-col items-center"><MessageCircle size={48} className="mb-4 opacity-20" /><p>This user hasn't emitted any public vibes yet.</p></div>)}
        </div>
      </div>
    </main>
  );
}