"use client";

import { useState, useEffect } from "react";
import { Flame, Snowflake, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useVibe } from "@/context/VibeProvider"; // 🌟 引入 Context

export default function VibeForecast() {
  const [boostCount, setBoostCount] = useState<number>(142);
  const [chillCount, setChillCount] = useState<number>(98);
  const [animations, setAnimations] = useState<{ id: number; type: 'boost' | 'chill' }[]>([]);
  
  // 🌟 获取全局设置方法
  const { setGlobalVibe } = useVibe();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setBoostCount(prev => prev + Math.floor(Math.random() * 2));
        setChillCount(prev => prev + Math.floor(Math.random() * 2)); 
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (type: 'boost' | 'chill') => {
    if (type === 'boost') setBoostCount(prev => prev + 1);
    else setChillCount(prev => prev + 1);

    const id = Date.now();
    setAnimations(prev => [...prev, { id, type }]);
    setTimeout(() => {
      setAnimations(prev => prev.filter(a => a.id !== id));
    }, 800);
  };

  const total = boostCount + chillCount;
  const boostPercentage = total > 0 ? (boostCount / total) * 100 : 50;
  const isFire = boostPercentage > 50;
  const displayTemp = boostPercentage.toFixed(1);

  // 🌟🌟🌟 核心：同步状态到全局 Context 🌟🌟🌟
  useEffect(() => {
    setGlobalVibe(isFire ? 'fire' : 'ice');
  }, [isFire, setGlobalVibe]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-8">
      <div className={clsx(
          "relative border rounded-2xl p-1 overflow-hidden transition-colors duration-700",
          isFire ? "border-vibe-fire/20" : "border-vibe-ice/20",
          "bg-white/5"
      )}>
        <div 
            className={clsx(
                "absolute inset-0 opacity-20 transition-all duration-1000",
                isFire 
                    ? "bg-gradient-to-r from-vibe-fire/30 to-transparent" 
                    : "bg-gradient-to-r from-vibe-ice/30 to-transparent"
            )} 
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          
          {/* Status */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500",
                isFire 
                    ? "bg-vibe-fire/10 border-vibe-fire text-vibe-fire shadow-orange-900/20" 
                    : "bg-vibe-ice/10 border-vibe-ice text-vibe-ice shadow-cyan-900/20"
            )}>
                {isFire ? <Flame size={24} className="animate-pulse" /> : <Snowflake size={24} className="animate-pulse" />}
            </div>
            <div>
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Activity size={10} /> Global Resonance
                </div>
                <div className="text-xl font-bold text-white flex items-center gap-2 transition-all">
                    <span className="min-w-[100px]">{isFire ? "Overheating" : "Sub-Zero"}</span>
                    <span className={clsx("text-xs px-2 py-0.5 rounded border font-mono transition-colors duration-500", isFire ? "text-vibe-fire border-vibe-fire/30 bg-vibe-fire/5" : "text-vibe-ice border-vibe-ice/30 bg-vibe-ice/5")}>
                        {displayTemp}°V
                    </span>
                </div>
            </div>
          </div>

          {/* Barometer */}
          <div className="flex-1 w-full px-4">
             <div className="flex justify-between text-xs font-bold mb-1.5 opacity-80">
                 <span className="text-vibe-fire flex items-center gap-1"><TrendingUp size={10} /> {Math.round(boostPercentage)}% Fire</span>
                 <span className="text-vibe-ice flex items-center gap-1">{100 - Math.round(boostPercentage)}% Ice <TrendingDown size={10} /></span>
             </div>
             <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden flex relative shadow-inner border border-white/5">
                 <motion.div 
                    className="h-full bg-gradient-to-r from-orange-600 to-vibe-fire relative" 
                    initial={{ width: "50%" }}
                    animate={{ width: `${boostPercentage}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 15 }}
                 >
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]" />
                 </motion.div>
                 <div className="h-full bg-gradient-to-r from-vibe-ice to-cyan-600 flex-1" />
             </div>
          </div>

          {/* Counters */}
          <div className="flex gap-4 w-full md:w-auto justify-end">
             <button 
                onClick={() => handleVote('boost')}
                className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 transition-all group active:scale-95 cursor-pointer overflow-hidden"
             >
                <Flame size={18} className="text-gray-600 group-hover:text-vibe-fire transition-colors" />
                <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-orange-400/80 font-bold tracking-wider">BOOST</div>
                    <div className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors w-16">
                        {(boostCount || 0).toLocaleString()}
                    </div>
                </div>
                <AnimatePresence>
                    {animations.filter(a => a.type === 'boost').map(anim => (
                        <motion.div key={anim.id} initial={{ opacity: 1, y: 0, x: 0 }} animate={{ opacity: 0, y: -20, x: 10 }} exit={{ opacity: 0 }} className="absolute right-2 top-1 text-vibe-fire font-bold text-xs pointer-events-none">+1</motion.div>
                    ))}
                </AnimatePresence>
             </button>

             <button 
                onClick={() => handleVote('chill')}
                className="relative flex items-center gap-3 px-4 py-2 rounded-xl bg-black/20 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all group active:scale-95 cursor-pointer overflow-hidden"
             >
                <Snowflake size={18} className="text-gray-600 group-hover:text-vibe-ice transition-colors" />
                <div className="text-left hidden sm:block">
                    <div className="text-[10px] text-cyan-400/80 font-bold tracking-wider">CHILL</div>
                    <div className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors w-16">
                        {(chillCount || 0).toLocaleString()}
                    </div>
                </div>
                <AnimatePresence>
                    {animations.filter(a => a.type === 'chill').map(anim => (
                        <motion.div key={anim.id} initial={{ opacity: 1, y: 0, x: 0 }} animate={{ opacity: 0, y: -20, x: 10 }} exit={{ opacity: 0 }} className="absolute right-2 top-1 text-vibe-ice font-bold text-xs pointer-events-none">+1</motion.div>
                    ))}
                </AnimatePresence>
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}