"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react"; // 引入 useEffect
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Snowflake, Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { getLeaderboard } from "@/app/actions"; // 引入真接口

interface LeaderboardUser {
  id: string;
  name: string;
  handle: string;
  vibeScore: number;
  avatar: string;
  faction: string;
  rank?: number;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'fire' | 'ice'>('all');
  const [search, setSearch] = useState("");

  // 🌟 加载真实数据
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getLeaderboard();
      setUsers(data);
      setLoading(false);
    };
    load();
  }, []);

  const displayedUsers = users
    .filter(u => filter === 'all' || u.faction === filter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.handle.toLowerCase().includes(search.toLowerCase()))
    .map((u, i) => ({ ...u, rank: i + 1 }));

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    if (rank === 2) return "bg-gray-400/20 text-gray-400 border-gray-400/50";
    if (rank === 3) return "bg-orange-700/20 text-orange-700 border-orange-700/50";
    return "bg-white/5 text-gray-500 border-white/5";
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" /> Global Leaderboard
          </h1>
          <p className="text-gray-500">Top resonant frequencies in the network.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search user..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white/30 outline-none transition-all"
            />
          </div>

          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setFilter('all')} className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all", filter === 'all' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white")}>All</button>
            <button onClick={() => setFilter('fire')} className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", filter === 'fire' ? "bg-vibe-fire/20 text-vibe-fire shadow-lg" : "text-gray-500 hover:text-vibe-fire")}><Flame size={14} /> Fire</button>
            <button onClick={() => setFilter('ice')} className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", filter === 'ice' ? "bg-vibe-ice/20 text-vibe-ice shadow-lg" : "text-gray-500 hover:text-vibe-ice")}><Snowflake size={14} /> Ice</button>
          </div>
        </div>

        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-vibe-fire" size={40} /></div>
        ) : (
            <div className="space-y-3">
            {displayedUsers.map((user) => (
                <motion.div 
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                >
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2", getRankStyle(user.rank || 0))}>
                    {(user.rank || 0) <= 3 ? <Medal size={20} /> : user.rank}
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                    <h3 className="text-white font-bold">{user.name}</h3>
                    <span className={clsx("text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold", user.faction === 'fire' ? "text-vibe-fire border-vibe-fire/30 bg-vibe-fire/5" : "text-vibe-ice border-vibe-ice/30 bg-vibe-ice/5")}>
                        {user.faction}
                    </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{user.handle}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Vibe Score</div>
                    <div className="text-xl font-mono font-bold text-white group-hover:text-vibe-fire transition-colors">
                    {user.vibeScore.toLocaleString()}
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        )}
      </div>
    </main>
  );
}