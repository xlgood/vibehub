"use client";

import { Flame, Snowflake, MessageCircle, Share2, Globe, Lock, Trash2, EyeOff } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { useVibe } from "@/context/VibeProvider";
import Link from "next/link";
import { voteVibe } from "@/app/actions"; // 🌟 引入 Server Action

export interface CardProps {
  id: string; // 🌟 修改：从 number 改为 string
  title: string;
  content: string;
  image: string;
  author: string;
  avatar: string;
  initialBoost: number;
  initialChill: number;
  timestamp: number;
  visibility?: 'public' | 'private';
}

interface VibeCardProps {
  data: CardProps;
  isOwner?: boolean;
  onDelete?: (id: string) => void; // 🌟 修改类型
  onTogglePrivacy?: (id: string) => void; // 🌟 修改类型
  disableProfileLink?: boolean;
}

export default function VibeCard({ data, isOwner, onDelete, onTogglePrivacy, disableProfileLink = false }: VibeCardProps) {
  const { user, isLoggedIn, addPoints, setGlobalVibe } = useVibe(); // 🌟 需要 user.id
  
  const [boostCount, setBoostCount] = useState(data.initialBoost);
  const [chillCount, setChillCount] = useState(data.initialChill);
  const [userVote, setUserVote] = useState<'boost' | 'chill' | null>(null);

  const handleVote = async (type: 'boost' | 'chill') => {
    if (!isLoggedIn || !user) {
        alert("Please login to resonate.");
        return;
    }
    
    // 乐观更新 UI (Optimistic UI Update)
    if (userVote === type) return;

    // 1. 立即更新界面数字，让用户感觉“零延迟”
    if (type === 'boost') {
      setBoostCount(prev => prev + 1);
      if (userVote === 'chill') setChillCount(prev => prev - 1);
      setGlobalVibe('fire');
    } else {
      setChillCount(prev => prev + 1);
      if (userVote === 'boost') setBoostCount(prev => prev - 1);
      setGlobalVibe('ice');
    }
    setUserVote(type);

    // 2. 默默在后台请求数据库
    await voteVibe(user.id, data.id, type);
    
    // 3. 顺便更新本地积分显示 (可选)
    addPoints(10);
  };

  const UserLink = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    if (disableProfileLink) return <div className={className}>{children}</div>;
    const userId = data.author.replace('@', ''); 
    return <Link href={`/user/${userId}`} className={className}>{children}</Link>;
  };

  return (
    <div className="group relative bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50">
      
      {/* Visibility Badge (Owner Only) */}
      {isOwner && (
        <div className="absolute top-3 left-3 z-20 flex gap-2">
            <div className={clsx(
                "px-2 py-1 rounded-lg backdrop-blur-md border text-[10px] font-bold uppercase flex items-center gap-1",
                data.visibility === 'public' ? "bg-black/40 border-white/20 text-white" : "bg-purple-900/40 border-purple-500/30 text-purple-300"
            )}>
                {data.visibility === 'public' ? <Globe size={10} /> : <Lock size={10} />}
                {data.visibility}
            </div>
        </div>
      )}

      {/* Owner Actions */}
      {isOwner && (
        <div className="absolute top-3 right-3 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button 
                onClick={(e) => { e.preventDefault(); onTogglePrivacy?.(data.id); }}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors backdrop-blur-md"
            >
                {data.visibility === 'public' ? <EyeOff size={14} /> : <Globe size={14} />}
            </button>
            <button 
                onClick={(e) => { e.preventDefault(); onDelete?.(data.id); }}
                className="p-2 rounded-full bg-black/60 text-red-400 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
            >
                <Trash2 size={14} />
            </button>
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent z-10 opacity-60" />
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
        />
        
        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-xl font-bold text-white mb-1 leading-tight break-words shadow-black drop-shadow-md">{data.title}</h3>
          
          <UserLink className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30">
                {data.avatar ? <img src={data.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-600" />}
            </div>
            <p className="text-xs text-gray-300 font-medium">{data.author}</p>
          </UserLink>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 break-words">
          {data.content}
        </p>

        {/* Action Bar */}
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
          <button 
            onClick={() => handleVote('boost')}
            className={clsx(
              "flex items-center justify-center gap-2 py-2 rounded-xl transition-all active:scale-95 touch-manipulation",
              userVote === 'boost' ? "bg-vibe-fire text-white shadow-lg shadow-orange-900/50" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-vibe-fire"
            )}
          >
            <Flame size={18} className={clsx(userVote === 'boost' && "fill-current")} />
            <span className="font-mono font-bold">{boostCount}</span>
          </button>
          <button 
            onClick={() => handleVote('chill')}
            className={clsx(
              "flex items-center justify-center gap-2 py-2 rounded-xl transition-all active:scale-95 touch-manipulation",
              userVote === 'chill' ? "bg-vibe-ice text-black shadow-lg shadow-cyan-900/50" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-vibe-ice"
            )}
          >
            <Snowflake size={18} className={clsx(userVote === 'chill' && "fill-current")} />
            <span className="font-mono font-bold">{chillCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}