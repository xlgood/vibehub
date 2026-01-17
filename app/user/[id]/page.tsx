"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Grid, Zap, Check, MapPin, Loader2, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import VibeCard, { CardProps } from "@/components/VibeCard";
import { getUserProfileData } from "@/app/actions";

interface UserProfile {
  username: string;
  handle: string;
  avatar: string;
  bio: string | null;
  points: number;
  vibeScore: number;
  faction: string;
  createdAt: Date;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getUserProfileData(userId);
      if (data) {
        setProfileUser({
            ...data.user,
            // 🌟 修复：如果 avatar 是 null，就转为空字符串
            avatar: data.user.avatar || "",
            faction: data.user.faction || 'neutral'
        });
        setCards(data.vibes);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="animate-spin text-vibe-fire" size={32} /></div>;
  if (!profileUser) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">User not found</div>;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className={clsx("absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40", profileUser.faction === 'fire' ? "bg-vibe-fire" : "bg-vibe-ice")} />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className={clsx("w-32 h-32 rounded-full border-4 overflow-hidden bg-black shrink-0 shadow-2xl", profileUser.faction === 'fire' ? "border-vibe-fire/50 shadow-orange-900/50" : "border-vibe-ice/50 shadow-cyan-900/50")}>
                <img src={profileUser.avatar} alt={profileUser.username} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{profileUser.username}</h1>
                        <span className={clsx("px-2 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1", profileUser.faction === 'fire' ? "text-vibe-fire border-vibe-fire bg-orange-900/20" : "text-vibe-ice border-vibe-ice bg-cyan-900/20")}><Zap size={10} fill="currentColor" /> {profileUser.faction}</span>
                    </div>
                    <p className="text-sm text-gray-500 font-mono mb-4">{profileUser.handle}</p>
                 </div>
                 <button onClick={() => setIsFollowing(!isFollowing)} className={clsx("px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2", isFollowing ? "bg-white/10 text-white border border-white/20" : "bg-white text-black hover:bg-gray-200")}>{isFollowing ? <><Check size={16} /> Following</> : "Follow"}</button>
              </div>
              <p className="text-gray-300 max-w-lg leading-relaxed mb-6">"{profileUser.bio || "No bio yet."}"</p>
              <div className="flex gap-6 text-sm"><div className="flex items-center gap-2 text-gray-400"><MapPin size={14} /> Global Network</div></div>
              <div className="flex gap-8 mt-6 border-t border-white/5 pt-6">
                <div><div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Vibe Score</div><div className="text-2xl font-mono font-bold text-white">{profileUser.vibeScore.toLocaleString()}</div></div>
                <div><div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Points</div><div className="text-2xl font-mono font-bold text-white">{profileUser.points.toLocaleString()}</div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 text-white font-bold pb-4 border-b border-white/10"><Grid size={18} /> Public Transmissions</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {cards.length > 0 ? (
             cards.map((card) => (
               <motion.div key={card.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                 <VibeCard data={card} isOwner={false} disableProfileLink={true} /> 
               </motion.div>
             ))
           ) : (<div className="col-span-full text-center py-20 text-gray-500 flex flex-col items-center"><MessageCircle size={48} className="mb-4 opacity-20" /><p>This user hasn't emitted any public vibes yet.</p></div>)}
        </div>
      </div>
    </main>
  );
}