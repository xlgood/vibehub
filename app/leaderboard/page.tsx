"use client";

import Navbar from "@/components/Navbar";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Snowflake, Crown, TrendingUp, Globe, Zap, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link"; // 🌟 引入 Link

// === 模拟原始数据池 ===
const RAW_DATA = [
  { id: 1, name: "NeonDrifter", baseScore: 15420, avatar: "https://i.pravatar.cc/150?u=1", faction: "fire" },
  { id: 2, name: "IceQueen", baseScore: 14850, avatar: "https://i.pravatar.cc/150?u=2", faction: "ice" },
  { id: 3, name: "CyberMonk", baseScore: 13900, avatar: "https://i.pravatar.cc/150?u=3", faction: "fire" },
  { id: 4, name: "PixelNinja", baseScore: 12500, avatar: "https://i.pravatar.cc/150?u=4", faction: "ice" },
  { id: 5, name: "GlitchHunter", baseScore: 11600, avatar: "https://i.pravatar.cc/150?u=6", faction: "fire" },
  { id: 6, name: "NightCityWalker", baseScore: 10400, avatar: "https://i.pravatar.cc/150?u=7", faction: "ice" },
  { id: 7, name: "RetroWave", baseScore: 9900, avatar: "https://i.pravatar.cc/150?u=8", faction: "fire" },
  { id: 8, name: "Synthesizer", baseScore: 8200, avatar: "https://i.pravatar.cc/150?u=9", faction: "ice" },
  { id: 9, name: "SolarFlare", baseScore: 7800, avatar: "https://i.pravatar.cc/150?u=11", faction: "fire" },
  { id: 10, name: "FrostByte", baseScore: 7500, avatar: "https://i.pravatar.cc/150?u=12", faction: "ice" },
  { id: 11, name: "InfernoSoul", baseScore: 6400, avatar: "https://i.pravatar.cc/150?u=13", faction: "fire" },
  { id: 12, name: "ZeroKelvin", baseScore: 6100, avatar: "https://i.pravatar.cc/150?u=14", faction: "ice" },
];

const MY_USER_DATA = { 
  id: 999, 
  name: "You", 
  baseScore: 1250, 
  avatar: "https://i.pravatar.cc/150?u=demo", 
  faction: "fire" 
};

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'all'>('weekly');
  const [factionFilter, setFactionFilter] = useState<'global' | 'fire' | 'ice'>('global');
  const [isAnimating, setIsAnimating] = useState(false);

  const displayData = useMemo(() => {
    let filtered = RAW_DATA.filter(u => {
      if (factionFilter === 'global') return true;
      return u.faction === factionFilter;
    });

    filtered = filtered.map(u => {
      let scoreMultiplier = 1;
      if (timeRange === 'daily') scoreMultiplier = 0.15 + (u.id % 3) * 0.05; 
      if (timeRange === 'all') scoreMultiplier = 10 + (u.id % 2); 
      return { ...u, vibeScore: Math.floor(u.baseScore * scoreMultiplier) };
    });

    return filtered.sort((a, b) => b.vibeScore - a.vibeScore).map((u, i) => ({ ...u, rank: i + 1 }));
  }, [timeRange, factionFilter]);

  const myStats = useMemo(() => {
    if (factionFilter !== 'global' && factionFilter !== MY_USER_DATA.faction) return null;
    let myCurrentScore = 0;
    if (timeRange === 'daily') myCurrentScore = 0; 
    else if (timeRange === 'weekly') myCurrentScore = Math.floor(MY_USER_DATA.baseScore * 1.0);
    else myCurrentScore = Math.floor(MY_USER_DATA.baseScore * 12.5);

    if (myCurrentScore === 0) return { isRanked: false, score: 0 };
    const mockRank = timeRange === 'weekly' ? 42 : 156;
    return { isRanked: true, rank: mockRank, score: myCurrentScore, faction: MY_USER_DATA.faction };
  }, [timeRange, factionFilter]);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [timeRange, factionFilter]);

  const getFactionStyle = (faction: string) => {
    if (faction === 'fire') return { color: 'text-vibe-fire', icon: Flame, border: 'border-vibe-fire', bg: 'bg-orange-500/10' };
    if (faction === 'ice') return { color: 'text-vibe-ice', icon: Snowflake, border: 'border-vibe-ice', bg: 'bg-cyan-400/10' };
    return { color: 'text-gray-400', icon: Zap, border: 'border-gray-500', bg: 'bg-white/5' };
  };

  const top3 = displayData.slice(0, 3);
  const restList = displayData.slice(3);

  return (
    <main className="min-h-screen pt-24 pb-32">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-mono uppercase tracking-tighter text-white mb-2 flex items-center gap-3">
              <Trophy className="text-yellow-400" size={36} /> 
              {factionFilter === 'global' ? 'Hall of Vibes' : factionFilter === 'fire' ? 'Fire Legion' : 'Ice Dominion'}
            </h1>
            <p className="text-gray-400 text-sm">Ranking by <span className="text-white font-bold">Vibe Intensity</span>.</p>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button onClick={() => setFactionFilter('global')} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all", factionFilter === 'global' ? "bg-white/10 text-white shadow-lg" : "text-gray-500 hover:text-white")}><Globe size={14} /> Global</button>
              <button onClick={() => setFactionFilter('fire')} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all", factionFilter === 'fire' ? "bg-vibe-fire text-white shadow-lg shadow-orange-900/50" : "text-gray-500 hover:text-vibe-fire")}><Flame size={14} /> Fire</button>
              <button onClick={() => setFactionFilter('ice')} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all", factionFilter === 'ice' ? "bg-vibe-ice text-black shadow-lg shadow-cyan-900/50" : "text-gray-500 hover:text-vibe-ice")}><Snowflake size={14} /> Ice</button>
            </div>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'all'] as const).map((t) => (
                <button key={t} onClick={() => setTimeRange(t)} className={clsx("px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border", timeRange === t ? "border-white/20 bg-white/10 text-white" : "border-transparent text-gray-600 hover:text-gray-400")}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <motion.div key={`${timeRange}-${factionFilter}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {top3.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-12 items-end">
                {/* No. 2 */}
                {(() => {
                    const user = top3[1];
                    const style = getFactionStyle(user.faction);
                    const Icon = style.icon;
                    return (
                    <div className="flex flex-col items-center group">
                        <Link href={`/user/${user.id}`} className="relative mb-4 cursor-pointer group-hover:scale-105 transition-transform">
                          <div className={clsx("w-20 h-20 rounded-full border-4 overflow-hidden shadow-lg", style.border)}>
                              <img src={user.avatar} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-black text-xs font-black px-2 py-0.5 rounded-full border border-white">#2</div>
                        </Link>
                        <div className="text-center">
                          <Link href={`/user/${user.id}`} className="font-bold text-gray-200 text-sm mb-1 hover:text-white">{user.name}</Link>
                          <div className={clsx("font-mono text-xs font-bold flex items-center justify-center gap-1", style.color)}>
                              <Icon size={12} fill="currentColor" /> {user.vibeScore}
                          </div>
                        </div>
                    </div>
                    );
                })()}

                {/* No. 1 */}
                {(() => {
                    const user = top3[0];
                    const style = getFactionStyle(user.faction);
                    const Icon = style.icon;
                    return (
                    <div className="flex flex-col items-center z-10 -mt-8 group">
                        <Link href={`/user/${user.id}`} className="relative mb-6 cursor-pointer group-hover:scale-105 transition-transform">
                          <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 fill-yellow-400 animate-bounce" size={40} />
                          <div className={clsx("w-28 h-28 rounded-full border-4 overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.3)] relative bg-black", style.border)}>
                              <img src={user.avatar} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-yellow-400/10 animate-pulse" />
                          </div>
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black text-sm font-black px-4 py-1 rounded-full border-2 border-white shadow-lg">#1</div>
                        </Link>
                        <div className="text-center">
                          <Link href={`/user/${user.id}`} className="font-bold text-white text-lg mb-1 hover:underline">{user.name}</Link>
                          <div className={clsx("font-mono text-base font-black flex items-center justify-center gap-2 px-3 py-1 rounded-full border", style.color, style.bg, style.border)}>
                              <Icon size={16} fill="currentColor" /> {user.vibeScore}
                          </div>
                        </div>
                    </div>
                    );
                })()}

                {/* No. 3 */}
                {(() => {
                    const user = top3[2];
                    const style = getFactionStyle(user.faction);
                    const Icon = style.icon;
                    return (
                    <div className="flex flex-col items-center group">
                        <Link href={`/user/${user.id}`} className="relative mb-4 cursor-pointer group-hover:scale-105 transition-transform">
                          <div className={clsx("w-20 h-20 rounded-full border-4 overflow-hidden shadow-lg", style.border)}>
                              <img src={user.avatar} className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs font-black px-2 py-0.5 rounded-full border border-white/20">#3</div>
                        </Link>
                        <div className="text-center">
                          <Link href={`/user/${user.id}`} className="font-bold text-gray-200 text-sm mb-1 hover:text-white">{user.name}</Link>
                          <div className={clsx("font-mono text-xs font-bold flex items-center justify-center gap-1", style.color)}>
                              <Icon size={12} fill="currentColor" /> {user.vibeScore}
                          </div>
                        </div>
                    </div>
                    );
                })()}
                </div>
            )}

            {/* List View */}
            <div className="space-y-3">
                {restList.length > 0 ? (
                    restList.map((user, index) => {
                    const style = getFactionStyle(user.faction);
                    const Icon = style.icon;
                    return (
                        <div key={user.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all hover:scale-[1.01]">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-gray-500 w-8 text-center font-bold text-lg">#{user.rank}</span>
                            {/* 🌟 核心修改：包裹 Link */}
                            <Link href={`/user/${user.id}`} className="flex items-center gap-4 group/item">
                                <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-800" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-200 text-sm group-hover/item:text-white transition-colors">{user.name}</span>
                                    <span className="text-[10px] text-gray-500 uppercase flex items-center gap-1">
                                        {user.faction === 'fire' && "🔥 Fire Faction"}
                                        {user.faction === 'ice' && "❄️ Ice Faction"}
                                    </span>
                                </div>
                            </Link>
                        </div>
                        <div className={clsx("font-mono font-bold flex items-center gap-2", style.color)}>
                            <Icon size={14} fill="currentColor" /> {user.vibeScore}
                        </div>
                        </div>
                    );
                    })
                ) : (
                    <div className="text-center py-20 text-gray-500"><p>No vibes found in this dimension.</p></div>
                )}
            </div>
        </motion.div>
      </div>

      {/* Sticky User Rank Bar */}
      <AnimatePresence>
        {myStats && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 w-full bg-[#151725]/90 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center min-w-[3rem]">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Rank</span>
                        {myStats.isRanked ? <span className="font-mono text-xl font-bold text-white">#{myStats.rank}</span> : <span className="font-mono text-lg font-bold text-gray-500">--</span>}
                    </div>
                    <div className="h-8 w-[1px] bg-white/10 mx-2" />
                    {/* 自己的头像也可以点击去自己的 Profile */}
                    <Link href="/profile">
                        <img src={MY_USER_DATA.avatar} className="w-10 h-10 rounded-full border border-white/20" />
                    </Link>
                    <div>
                        <div className="font-bold text-white text-sm">{MY_USER_DATA.name} <span className="text-gray-500 text-xs font-normal">(You)</span></div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                            {myStats.isRanked ? <><TrendingUp size={12} className="text-green-400" /> Rising Star</> : <><AlertCircle size={12} className="text-gray-500" /> Not ranked in {timeRange}</>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase font-bold">My Intensity</div>
                        {myStats.isRanked ? ((() => { const style = getFactionStyle(myStats.faction); const Icon = style.icon; return (<div className={clsx("font-mono text-xl font-bold flex items-center justify-end gap-2", style.color)}><Icon size={18} fill="currentColor" /> {myStats.score}</div>); })()) : (<div className="font-mono text-xl font-bold flex items-center justify-end gap-2 text-gray-600">0</div>)}
                    </div>
                </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}