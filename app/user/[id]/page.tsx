"use client";

import Navbar from "@/components/Navbar";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Grid, Flame, Snowflake, MessageCircle, MapPin, Zap, Check, Share2 } from "lucide-react";
import { clsx } from "clsx";
import VibeCard, { CardProps } from "@/components/VibeCard";
import { useVibe } from "@/context/VibeProvider";

// Mock Data
const MOCK_USER = {
  id: 'u1', // 字符串 ID
  username: "NeonDrifter",
  handle: "@neon_drifter",
  avatar: "https://i.pravatar.cc/150?u=1",
  bio: "Chasing digital sunsets across the grid. Fire faction elite.",
  points: 12580,
  vibeScore: 4820,
  faction: "fire",
  followers: 842,
  following: 156,
  joined: "Oct 2024"
};

const MOCK_USER_CARDS: CardProps[] = [
  { id: '101', title: 'Secret Project', content: 'Hidden vibe.', image: 'https://picsum.photos/seed/secret/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 0, initialChill: 0, timestamp: Date.now(), visibility: 'private' },
  { id: '102', title: 'Neon Nights', content: 'The city never sleeps.', image: 'https://picsum.photos/seed/88/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 85, initialChill: 12, timestamp: Date.now() - 100000, visibility: 'public' },
  { id: '103', title: 'Coffee Run', content: 'Fuel for the code.', image: 'https://picsum.photos/seed/12/400/600', author: 'NeonDrifter', avatar: MOCK_USER.avatar, initialBoost: 45, initialChill: 20, timestamp: Date.now() - 500000, visibility: 'public' },
];

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id; // Get ID from URL
  
  // In a real app, fetch user data by userId
  // const { data: user } = useFetchUser(userId);
  const user = MOCK_USER; 

  const { isLoggedIn } = useVibe();
  const [isFollowing, setIsFollowing] = useState(false);

  const publicCards = useMemo(() => {
    return MOCK_USER_CARDS.filter(c => c.visibility === 'public');
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Profile Header */}
        <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className={clsx(
            "absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40",
            user.faction === 'fire' ? "bg-vibe-fire" : "bg-vibe-ice"
          )} />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className={clsx(
                "w-32 h-32 rounded-full border-4 overflow-hidden bg-black shrink-0 shadow-2xl",
                user.faction === 'fire' ? "border-vibe-fire/50 shadow-orange-900/50" : "border-vibe-ice/50 shadow-cyan-900/50"
            )}>
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                        <span className={clsx(
                            "px-2 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1",
                            user.faction === 'fire' ? "text-vibe-fire border-vibe-fire bg-orange-900/20" : "text-vibe-ice border-vibe-ice bg-cyan-900/20"
                        )}>
                            <Zap size={10} fill="currentColor" /> {user.faction}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 font-mono mb-4">{user.handle}</p>
                 </div>

                 <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={clsx(
                        "px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                        isFollowing 
                            ? "bg-white/10 text-white border border-white/20" 
                            : "bg-white text-black hover:bg-gray-200"
                    )}
                 >
                    {isFollowing ? <><Check size={16} /> Following</> : "Follow"}
                 </button>
              </div>

              <p className="text-gray-300 max-w-lg leading-relaxed mb-6">"{user.bio}"</p>

              <div className="flex gap-6 text-sm">
                 <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={14} /> Global Network
                 </div>
                 <div className="text-gray-400">Joined {user.joined}</div>
              </div>

              <div className="flex gap-8 mt-6 border-t border-white/5 pt-6">
                <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Vibe Score</div>
                    <div className="text-2xl font-mono font-bold text-white">{user.vibeScore.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Followers</div>
                    <div className="text-2xl font-mono font-bold text-white">{user.followers}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Following</div>
                    <div className="text-2xl font-mono font-bold text-white">{user.following}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Public Feed */}
        <div className="mb-6 flex items-center gap-2 text-white font-bold pb-4 border-b border-white/10">
            <Grid size={18} /> Public Transmissions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {publicCards.length > 0 ? (
             publicCards.map((card) => (
               <motion.div key={card.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                 <VibeCard 
                    data={card} 
                    isOwner={false} 
                    disableProfileLink={true} 
                 /> 
               </motion.div>
             ))
           ) : (<div className="col-span-3 text-center py-20 text-gray-500 flex flex-col items-center"><MessageCircle size={48} className="mb-4 opacity-20" /><p>This user hasn't emitted any public vibes yet.</p></div>)}
        </div>

      </div>
    </main>
  );
}