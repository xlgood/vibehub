"use client";

import Navbar from "@/components/Navbar";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Snowflake, Search } from "lucide-react";
import { clsx } from "clsx";

// 🌟 定义接口以确保类型安全
interface LeaderboardUser {
  id: number;
  name: string;
  handle: string;
  vibeScore: number; // 统一使用 vibeScore
  avatar: string;
  faction: 'fire' | 'ice';
}

// 🌟 生成模拟数据
const MOCK_LEADERBOARD: LeaderboardUser[] = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: i === 0 ? "NeonDrifter" : `User_${Math.random().toString(36).substring(7)}`,
  handle: i === 0 ? "@neon_drifter" : `@user_${i}`,
  vibeScore: Math.floor(Math.random() * 50000) + 1000, // 修复：这里原来可能是 baseScore
  avatar: `https://i.pravatar.cc/150?u=${i + 10}`,
  faction: Math.random() > 0.5 ? 'fire' : 'ice',
}));

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'all' | 'fire' | 'ice'>('all');
  const [search, setSearch] = useState("");

  // 处理排序和过滤
  const sortedUsers = useMemo(() => {
    let data = [...MOCK_LEADERBOARD];

    // 1. 过滤阵营
    if (filter !== 'all') {
      data = data.filter(u => u.faction === filter);
    }

    // 2. 搜索
    if (search) {
      data = data.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.handle.toLowerCase().includes(search.toLowerCase()));
    }

    // 3. 排序 (🌟 修复：确保使用 vibeScore)
    return data.sort((a, b) => b.vibeScore - a.vibeScore).map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  }, [filter, search]);

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
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" /> Global Leaderboard
          </h1>
          <p className="text-gray-500">Top resonant frequencies in the network.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
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

          {/* Filters */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setFilter('all')}
              className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all", filter === 'all' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white")}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('fire')}
              className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", filter === 'fire' ? "bg-vibe-fire/20 text-vibe-fire shadow-lg" : "text-gray-500 hover:text-vibe-fire")}
            >
              <Flame size={14} /> Fire
            </button>
            <button 
              onClick={() => setFilter('ice')}
              className={clsx("px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2", filter === 'ice' ? "bg-vibe-ice/20 text-vibe-ice shadow-lg" : "text-gray-500 hover:text-vibe-ice")}
            >
              <Snowflake size={14} /> Ice
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {sortedUsers.map((user) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
            >
              {/* Rank */}
              <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center font-bold border-2", getRankStyle(user.rank))}>
                {user.rank <= 3 ? <Medal size={20} /> : user.rank}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold">{user.name}</h3>
                  <span className={clsx("text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold", user.faction === 'fire' ? "text-vibe-fire border-vibe-fire/30 bg-vibe-fire/5" : "text-vibe-ice border-vibe-ice/30 bg-vibe-ice/5")}>
                    {user.faction}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-mono">{user.handle}</p>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Vibe Score</div>
                <div className="text-xl font-mono font-bold text-white group-hover:text-vibe-fire transition-colors">
                  {user.vibeScore.toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}

          {sortedUsers.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No vibes found matching your frequency.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}