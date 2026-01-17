"use client";

import { useState } from "react";
import Link from "next/link";
// 🌟 修正：图标全部从 lucide-react 导入
import { 
  Flame, Snowflake, Share2, MoreHorizontal, Flag, Ban, Check, X, 
  AlertTriangle, ShieldCheck, Trash2, Lock, Globe, Twitter, Link2 
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
// 🌟 修正：react-share 只导入功能组件
import { TwitterShareButton, PinterestShareButton, RedditShareButton } from "react-share";
import { useVibe } from "@/context/VibeProvider"; 

export interface CardProps {
  id: number;
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

const REPORT_REASONS = [
  "Spam or misleading",
  "Nudity or sexual content",
  "Hate speech or symbols",
  "Violence or dangerous organizations",
  "Bullying or harassment"
];

export default function VibeCard({ 
  data, 
  isOwner = false, 
  disableProfileLink = false, 
  onDelete, 
  onTogglePrivacy 
}: { 
  data: CardProps; 
  isOwner?: boolean;
  disableProfileLink?: boolean;
  onDelete?: (id: number) => void;
  onTogglePrivacy?: (id: number) => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [boostCount, setBoostCount] = useState(data.initialBoost);
  const [chillCount, setChillCount] = useState(data.initialChill);
  const [userVote, setUserVote] = useState<'boost' | 'chill' | null>(null);
  
  const [showMenu, setShowMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [activeModal, setActiveModal] = useState<'none' | 'report' | 'block' | 'report_success' | 'share'>('none');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // 本地 Toast
  const [toast, setToast] = useState<string | null>(null);

  const [animations, setAnimations] = useState<{ id: number; type: 'boost' | 'chill' }[]>([]);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const { isLoggedIn } = useVibe(); 

  const finalVibe = boostCount - chillCount;
  const vibeType = finalVibe > 0 ? 'fire' : finalVibe < 0 ? 'ice' : 'neutral';
  const intensity = Math.abs(finalVibe);

  if (isBlocked) return null;

  const showAuthToast = () => {
    setToast("Please Login to interact.");
    setTimeout(() => setToast(null), 2000);
  };

  const getGlowClass = () => {
    if (vibeType === 'neutral') return 'glow-neutral';
    let level = 'low';
    if (intensity > 50) level = 'high';
    else if (intensity > 10) level = 'mid';
    return `glow-${vibeType}-${level}`;
  };

  const handleVote = (e: React.MouseEvent, type: 'boost' | 'chill') => {
    e.stopPropagation(); 
    
    if (!isLoggedIn) {
        showAuthToast();
        return;
    }
    if (isOwner) return;

    if (userVote && userVote !== type) return;

    if (userVote === type) {
      if (type === 'boost') setBoostCount(p => p - 1);
      else setChillCount(p => p - 1);
      setUserVote(null); 
    } else {
      if (type === 'boost') setBoostCount(p => p + 1);
      else setChillCount(p => p + 1);
      setUserVote(type);
      triggerAnimation(type);
    }
  };

  const triggerAnimation = (type: 'boost' | 'chill') => {
    const id = Date.now();
    setAnimations(prev => [...prev, { id, type }]);
    setTimeout(() => setAnimations(prev => prev.filter(a => a.id !== id)), 800);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setActiveModal('share');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${data.title}\n${shareUrl}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {}
  };

  const openModal = (e: React.MouseEvent, type: 'report' | 'block') => {
    e.stopPropagation();
    if (!isLoggedIn) {
        showAuthToast();
        return;
    }
    setShowMenu(false); 
    setActiveModal(type); 
    setSelectedReason(null); 
  };

  const submitReport = () => {
    if (!selectedReason) return;
    setActiveModal('report_success');
  };

  const confirmBlock = () => {
    setActiveModal('none');
    setIsBlocked(true);
  };

  const handleOwnerAction = (e: React.MouseEvent, action: 'delete' | 'privacy') => {
    e.stopPropagation();
    if (action === 'delete' && onDelete) onDelete(data.id);
    if (action === 'privacy' && onTogglePrivacy) onTogglePrivacy(data.id);
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  const AvatarContent = () => (
    <>
      <img src={data.avatar} alt={data.author} className="w-8 h-8 rounded-full border border-white/20 group-hover/author:border-white transition-colors" />
      <span className="text-xs font-bold text-white shadow-black drop-shadow-md group-hover/author:underline cursor-pointer">@{data.author}</span>
    </>
  );

  return (
    <>
      <div className="h-[450px] w-full perspective-1000 group relative z-0">
        <div 
          className={clsx(
            "relative w-full h-full transition-all duration-500 transform-style-3d rounded-2xl bg-vibe-dark cursor-pointer",
            isFlipped ? "rotate-y-180" : "",
            getGlowClass()
          )}
          onClick={() => {
              if (activeModal !== 'none') return;
              setIsFlipped(!isFlipped);
              if (showMenu) setShowMenu(false);
          }}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden">
            <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${data.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-vibe-black/90 via-vibe-black/20 to-transparent" />
              
              {data.visibility === 'private' && (
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md p-2 rounded-full text-red-400 border border-red-500/30 shadow-lg">
                    <Lock size={16} />
                </div>
              )}

              <div className="absolute top-4 left-4 z-10" onClick={stopProp}>
                {disableProfileLink ? (
                    <div className="flex items-center gap-2 group/author opacity-90 cursor-default">
                        <AvatarContent />
                    </div>
                ) : (
                    <Link href={`/user/${data.id}`} className="flex items-center gap-2 group/author">
                        <AvatarContent />
                    </Link>
                )}
              </div>

              <div className="absolute bottom-0 w-full p-5 text-left">
                <div className="flex justify-between items-end mb-2">
                  <div className={clsx(
                    "font-mono font-bold text-lg px-2 py-1 rounded-lg backdrop-blur-sm border border-white/5 flex items-center gap-2",
                    vibeType === 'fire' ? "text-vibe-fire bg-orange-900/30" : 
                    vibeType === 'ice' ? "text-vibe-ice bg-cyan-900/30" : "text-gray-400 bg-gray-900/30"
                  )}>
                    {vibeType === 'fire' && <Flame size={16} fill="currentColor" />}
                    {vibeType === 'ice' && <Snowflake size={16} fill="currentColor" />}
                    {intensity}
                  </div>
                </div>
                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 drop-shadow-lg">{data.title}</h3>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl bg-vibe-dark p-6 flex flex-col border border-white/10">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 relative cursor-default" onClick={stopProp}>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Details</span>
              
              {isOwner ? (
                <div className="flex gap-2">
                  <button onClick={(e) => handleOwnerAction(e, 'privacy')} className={clsx("w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer border", data.visibility === 'private' ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20")} title={data.visibility === 'private' ? "Make Public" : "Make Private"}>
                    {data.visibility === 'private' ? <Lock size={16} /> : <Globe size={16} />}
                  </button>
                  <button onClick={(e) => handleOwnerAction(e, 'delete')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer" title="Delete Vibe"><Trash2 size={16} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer" title="Share" onClick={handleShareClick}><Share2 size={16} /></button>
                  <div className="relative">
                    <button className={clsx("w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer", showMenu ? "text-white bg-white/10" : "text-gray-400")} title="More" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}><MoreHorizontal size={16} /></button>
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} transition={{ duration: 0.1 }} className="absolute right-0 top-10 w-36 bg-[#151725] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col py-1 cursor-default">
                                <button onClick={(e) => openModal(e, 'report')} className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"><Flag size={12} /> Report</button>
                                <button onClick={(e) => openModal(e, 'block')} className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer"><Ban size={12} /> Block Card</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-grow overflow-y-auto no-scrollbar">
              <div onClick={stopProp} className="cursor-text space-y-4">
                <p className="text-sm text-gray-300 leading-relaxed">{data.content}</p>
                <p className="text-sm text-gray-500 italic">... (Full story content) ...</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center gap-4">
              <button onClick={(e) => handleVote(e, 'chill')} disabled={userVote === 'boost' || isOwner} className={clsx("flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all relative overflow-hidden", isOwner ? "opacity-50 cursor-not-allowed bg-white/5 text-gray-500 border-transparent" : userVote === 'chill' ? "bg-vibe-ice text-vibe-black border-vibe-ice shadow-[0_0_15px_rgba(34,211,238,0.4)] active:scale-95" : userVote === 'boost' ? "opacity-20 cursor-not-allowed border-transparent bg-white/5 text-gray-500 grayscale" : "bg-cyan-900/10 text-vibe-ice border-cyan-900/30 hover:bg-vibe-ice hover:text-vibe-black active:scale-95 group cursor-pointer")}>
                {!isOwner && <AnimatePresence>{animations.filter(a => a.type === 'chill').map(anim => (<motion.div key={anim.id} initial={{opacity:1,y:0}} animate={{opacity:0,y:-30}} exit={{opacity:0}} transition={{duration:0.5}} className="absolute top-1 font-black">+1</motion.div>))}</AnimatePresence>}
                <Snowflake size={16} fill={userVote === 'chill' ? "currentColor" : "none"} /> <span className="text-xs font-bold">Chill</span>
              </button>

              <button onClick={(e) => handleVote(e, 'boost')} disabled={userVote === 'chill' || isOwner} className={clsx("flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all relative overflow-hidden", isOwner ? "opacity-50 cursor-not-allowed bg-white/5 text-gray-500 border-transparent" : userVote === 'boost' ? "bg-vibe-fire text-white border-vibe-fire shadow-[0_0_15px_rgba(249,115,22,0.4)] active:scale-95" : userVote === 'chill' ? "opacity-20 cursor-not-allowed border-transparent bg-white/5 text-gray-500 grayscale" : "bg-orange-900/10 text-vibe-fire border-orange-900/30 hover:bg-vibe-fire hover:text-white active:scale-95 group cursor-pointer")}>
                 {!isOwner && <AnimatePresence>{animations.filter(a => a.type === 'boost').map(anim => (<motion.div key={anim.id} initial={{opacity:1,y:0}} animate={{opacity:0,y:-30}} exit={{opacity:0}} transition={{duration:0.5}} className="absolute top-1 font-black">+1</motion.div>))}</AnimatePresence>}
                <Flame size={16} fill={userVote === 'boost' ? "currentColor" : "none"} /> <span className="text-xs font-bold">Boost</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 🌟 Toast for Auth Warning */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-red-500/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl pointer-events-none whitespace-nowrap">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 Global Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-[#151725] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
              <button onClick={() => setActiveModal('none')} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
              
              {activeModal === 'block' && (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500"><Ban size={24} /></div>
                  <h3 className="text-lg font-bold text-white mb-2">Block this Card?</h3>
                  <p className="text-sm text-gray-400 mb-6">You won't see this content again.</p>
                  <div className="flex gap-3"><button onClick={() => setActiveModal('none')} className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 font-bold text-sm">Cancel</button><button onClick={confirmBlock} className="flex-1 py-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-600/50 font-bold text-sm">Confirm</button></div>
                </div>
              )}
              
              {activeModal === 'report' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Report Content</h3>
                  <div className="space-y-2 mb-6">{REPORT_REASONS.map(reason => (<button key={reason} onClick={() => setSelectedReason(reason)} className={clsx("w-full text-left px-4 py-3 rounded-xl border text-sm transition-all", selectedReason === reason ? "bg-vibe-fire/10 border-vibe-fire text-vibe-fire" : "bg-white/5 border-transparent text-gray-300")}>{reason}</button>))}</div>
                  <button onClick={submitReport} disabled={!selectedReason} className={clsx("w-full py-3 rounded-xl font-bold text-sm", selectedReason ? "bg-vibe-fire text-white" : "bg-white/5 text-gray-500")}>Submit Report</button>
                </div>
              )}
              
              {activeModal === 'report_success' && (
                <div className="text-center py-4"><ShieldCheck size={32} className="mx-auto mb-4 text-green-500" /><h3 className="text-xl font-bold text-white mb-2">Report Sent</h3><button onClick={() => setActiveModal('none')} className="w-full py-3 rounded-xl bg-white/10 font-bold text-sm mt-4">Got it</button></div>
              )}
              
              {activeModal === 'share' && (
                <div>
                  <h3 className="text-center text-lg font-bold text-white mb-6">Share</h3>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <TwitterShareButton url={shareUrl} className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-500 transition-colors"><Twitter size={20} /></TwitterShareButton>
                    <PinterestShareButton url={shareUrl} media={data.image} description={data.title} className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors">Pin</PinterestShareButton>
                    <RedditShareButton url={shareUrl} title={data.title} className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500/20 hover:text-orange-500 transition-colors">R</RedditShareButton>
                    <button onClick={copyLink} className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center hover:bg-green-500/20 hover:text-green-500 transition-colors"><Link2 size={20} /></button>
                  </div>
                  <div className="bg-black/40 p-2 rounded-xl flex items-center text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">{shareUrl}</div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}