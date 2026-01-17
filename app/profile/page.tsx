"use client";

import Navbar from "@/components/Navbar";
import VibeCard from "@/components/VibeCard";
import { useVibe } from "@/context/VibeProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Edit2, Save, X, Camera, Loader2, Zap, Grid, Lock } from "lucide-react";
import { clsx } from "clsx";

// 🌟 修复：ID改为字符串
const MOCK_MY_CARDS = [
  { id: '101', title: 'Secret Project', content: 'Hidden vibe.', image: 'https://picsum.photos/seed/secret/400/600', author: 'Me', avatar: '', initialBoost: 0, initialChill: 0, timestamp: Date.now(), visibility: 'private' as const },
  { id: '102', title: 'Neon Nights', content: 'The city never sleeps.', image: 'https://picsum.photos/seed/88/400/600', author: 'Me', avatar: '', initialBoost: 85, initialChill: 12, timestamp: Date.now() - 100000, visibility: 'public' as const },
];

export default function ProfilePage() {
  const { user, updateUser, isLoggedIn } = useVibe();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [editMode, setEditMode] = useState(false);
  
  const [tempUsername, setTempUsername] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
       if (!isLoggedIn) {
          router.push("/login");
       }
    }, 500); 
    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (editMode && user) {
      setTempUsername(user.username);
      setTempBio(user.bio);
    }
  }, [editMode, user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    
    updateUser({
      username: tempUsername,
      bio: tempBio
    });
    
    setIsSaving(false);
    setEditMode(false);
  };

  if (!user) {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center">
            <Loader2 className="animate-spin text-vibe-fire" size={32} />
        </main>
    );
  }

  const myCards = MOCK_MY_CARDS.map(c => ({...c, author: user.username, avatar: user.avatar}));
  const filteredCards = myCards.filter(c => c.visibility === activeTab);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
          <div className={clsx(
            "absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full pointer-events-none opacity-40 transition-colors duration-1000",
            user.faction === 'fire' ? "bg-vibe-fire" : user.faction === 'ice' ? "bg-vibe-ice" : "bg-purple-500"
          )} />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
            <div className="relative group/avatar">
                <div className={clsx(
                    "w-32 h-32 rounded-full border-4 overflow-hidden bg-black shrink-0 shadow-2xl transition-all",
                    user.faction === 'fire' ? "border-vibe-fire/50 shadow-orange-900/50" : "border-vibe-ice/50 shadow-cyan-900/50"
                )}>
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex justify-between items-start">
                 <div className="space-y-2 w-full">
                    {editMode ? (
                        <div className="space-y-3 max-w-md">
                            <input 
                                type="text" 
                                value={tempUsername}
                                onChange={(e) => setTempUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xl font-bold text-white focus:border-vibe-fire outline-none"
                                placeholder="Username"
                            />
                            <textarea 
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-vibe-fire outline-none resize-none h-24"
                                placeholder="Bio..."
                            />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold border flex items-center gap-1",
                                    user.faction === 'fire' ? "text-vibe-fire border-vibe-fire bg-orange-900/20" : 
                                    user.faction === 'ice' ? "text-vibe-ice border-vibe-ice bg-cyan-900/20" : "text-gray-400 border-gray-500"
                                )}>
                                    <Zap size={10} fill="currentColor" /> {user.faction} Faction
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-mono">{user.handle}</p>
                            <p className="text-gray-300 max-w-lg leading-relaxed">"{user.bio}"</p>
                        </>
                    )}
                 </div>

                 <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button 
                                onClick={() => setEditMode(false)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2 px-4 font-bold"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                Save
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setEditMode(true)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <Edit2 size={18} />
                        </button>
                    )}
                    <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                        <Settings size={18} />
                    </button>
                 </div>
              </div>

              <div className="flex gap-6 mt-6 border-t border-white/5 pt-6">
                <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Points</div>
                    <div className="text-2xl font-mono font-bold text-white">{user.points.toLocaleString()}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Vibe Score</div>
                    <div className={clsx("text-2xl font-mono font-bold", user.faction === 'fire' ? "text-vibe-fire" : "text-vibe-ice")}>
                        {user.vibeScore}
                    </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex gap-6 mb-8 border-b border-white/10 pb-1">
            <button 
                onClick={() => setActiveTab('public')}
                className={clsx(
                    "pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2",
                    activeTab === 'public' ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300"
                )}
            >
                <Grid size={16} /> Public Vibes
            </button>
            <button 
                onClick={() => setActiveTab('private')}
                className={clsx(
                    "pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2",
                    activeTab === 'private' ? "text-white border-white" : "text-gray-500 border-transparent hover:text-gray-300"
                )}
            >
                <Lock size={16} /> Private Collection
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
                {filteredCards.length > 0 ? (
                    filteredCards.map((card) => (
                        <motion.div 
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* 🌟 修复：disableProfileLink 类型匹配 */}
                            <VibeCard 
                                data={card} 
                                isOwner={true}
                                onDelete={(id) => console.log("Delete", id)}
                                onTogglePrivacy={(id) => console.log("Toggle Privacy", id)}
                                disableProfileLink={true} 
                            />
                        </motion.div>
                    ))
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="col-span-full py-20 text-center text-gray-500 border border-dashed border-white/10 rounded-3xl"
                    >
                        <p>No vibes found in this frequency.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </main>
  );
}