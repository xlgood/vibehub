"use client";

import Navbar from "@/components/Navbar";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, Grid, ShoppingBag, Camera, Save, X, Zap, Gift, CheckCircle, AlertTriangle, Smile, Mail, Key, Flame, Snowflake, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import VibeCard, { CardProps } from "@/components/VibeCard";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/canvasUtils";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { useVibe } from "@/context/VibeProvider"; // 🌟 引入全局 Context

const SHOP_ITEMS = [
  { 
    id: 1, name: "Energy Transmutation", cost: 0, icon: Zap, color: "text-vibe-fire", 
    desc: "Convert Points into raw Vibe energy. Affects your alignment." 
  }
];

// Mock cards (Ideally these would come from an API based on user.id)
const INITIAL_MY_CARDS: CardProps[] = [
  { id: 101, title: 'My Secret Thoughts', content: 'This is for my eyes only.', image: 'https://picsum.photos/seed/secret/400/600', author: 'NeonDrifter', avatar: "https://i.pravatar.cc/150?u=1", initialBoost: 0, initialChill: 0, timestamp: Date.now(), visibility: 'private' },
  { id: 102, title: 'Public Announcement', content: 'Hello world!', image: 'https://picsum.photos/seed/public/400/600', author: 'NeonDrifter', avatar: "https://i.pravatar.cc/150?u=1", initialBoost: 12, initialChill: 5, timestamp: Date.now() - 100000, visibility: 'public' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'vibes' | 'settings' | 'shop'>('vibes');
  
  // 🌟 使用全局状态，替代本地 user state
  const { user, updateUser } = useVibe(); 
  
  const [myCards, setMyCards] = useState<CardProps[]>(INITIAL_MY_CARDS);
  const [pointsAnim, setPointsAnim] = useState<number | null>(null);

  // Settings State
  const [editMode, setEditMode] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Avatar Crop State
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // Transmute State
  const [showTransmuteModal, setShowTransmuteModal] = useState(false);
  const [transmuteAmount, setTransmuteAmount] = useState(100); 
  const [targetFaction, setTargetFaction] = useState<'fire' | 'ice'>('fire'); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);

  const EXCHANGE_RATE = 100;

  // 当进入编辑模式时，同步当前全局数据到临时 State
  useEffect(() => {
    if (editMode) {
        setTempUsername(user.username);
        setTempBio(user.bio);
    }
  }, [editMode, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setAvatarSrc(reader.result?.toString() || null);
        setIsCropping(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveAvatar = async () => {
    if (avatarSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(avatarSrc, croppedAreaPixels);
      if (croppedImage) {
        // 🌟 更新全局头像
        updateUser({ avatar: croppedImage });
        setAvatarSrc(null);
        setIsCropping(false);
        showToast("Avatar updated successfully!", "success");
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = bioInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart || 0;
      const end = textarea.selectionEnd || 0;
      const newValue = tempBio.substring(0, start) + emoji + tempBio.substring(end);
      setTempBio(newValue);
      setTimeout(() => textarea.focus(), 0);
    } else {
      setTempBio(prev => prev + emoji);
    }
  };

  const saveProfile = () => {
    if (tempUsername.length < 3 || tempUsername.length > 20) return showToast("Username must be 3-20 chars.", "error");
    if (!/^[a-zA-Z0-9_ ]+$/.test(tempUsername)) return showToast("Username contains invalid characters.", "error");
    if (tempBio.length > 100) return showToast("Bio is too long (max 100).", "error");
    
    // 🌟 更新全局资料
    updateUser({ username: tempUsername, bio: tempBio });
    setEditMode(false);
    setShowEmojiPicker(false);
    showToast("Profile updated successfully!", "success");
  };

  const handleDeleteCard = (id: number) => {
    if(confirm("Are you sure you want to delete this Vibe?")) {
        setMyCards(prev => prev.filter(c => c.id !== id));
        showToast("Vibe deleted.", "success");
    }
  };

  const handleTogglePrivacy = (id: number) => {
    setMyCards(prev => prev.map(c => {
      if (c.id === id) {
        const newVisibility = c.visibility === 'public' ? 'private' : 'public';
        showToast(`Vibe is now ${newVisibility}.`, "success");
        return { ...c, visibility: newVisibility };
      }
      return c;
    }));
  };

  const handleItemClick = (item: typeof SHOP_ITEMS[0]) => {
    if (item.id === 1) {
        setTransmuteAmount(100);
        // 默认让用户选择当前阵营，或者 Fire
        setTargetFaction(user.faction === 'neutral' ? 'fire' : user.faction); 
        setShowTransmuteModal(true);
    }
  };

  const executeTransmute = () => {
    if (user.points >= transmuteAmount) {
        const energyGain = Math.floor(transmuteAmount / EXCHANGE_RATE);
        
        let currentNetScore = user.vibeScore;
        if (user.faction === 'ice') currentNetScore = -user.vibeScore;
        
        const impactVector = targetFaction === 'fire' ? energyGain : -energyGain;
        const newNetScore = currentNetScore + impactVector;

        let newFaction: 'fire' | 'ice' | 'neutral' = user.faction;
        if (newNetScore > 0) newFaction = 'fire';
        else if (newNetScore < 0) newFaction = 'ice';
        else newFaction = 'neutral';

        const newAbsScore = Math.abs(newNetScore);
        const factionChanged = newFaction !== user.faction && user.faction !== 'neutral';

        // 🌟 更新全局状态
        updateUser({ 
            points: user.points - transmuteAmount,
            vibeScore: newAbsScore,
            faction: newFaction
        });
        
        setShowTransmuteModal(false);
        setPointsAnim(-transmuteAmount);
        
        if (factionChanged) {
            showToast(`⚠️ FACTION SHIFT! You are now ${newFaction.toUpperCase()}.`, "success");
        } else if (newFaction === 'neutral') {
            showToast(`Energy Neutralized. You are now Neutral.`, "success");
        } else {
            showToast(`Energy Infused.`, "success");
        }
        
        setTimeout(() => setPointsAnim(null), 1500);
    } else {
        showToast("Not enough points!", "error");
    }
  };

  // ... (sendCode, updatePassword 省略，保持不变，它们只涉及 UI 提示) ...
  const sendCode = () => {
    if (!currentPassword) return showToast("Please enter current password.", "error");
    setIsCodeSent(true);
    showToast(`Verification code sent to ${user.email} (Hint: 1234)`, "success");
  };

  const updatePassword = () => {
    if (emailCode !== "1234") return showToast("Invalid verification code.", "error");
    if (newPassword.length < 6) return showToast("New password too short.", "error");
    showToast("Password changed successfully. Please re-login.", "success");
    setCurrentPassword("");
    setNewPassword("");
    setEmailCode("");
    setIsCodeSent(false);
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={clsx(
                "fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md",
                toast.type === 'success' ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"
            )}
          >
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header (UserInfo) */}
        <div className="relative mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 overflow-visible">
          <div className={clsx("absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000", user.faction === 'fire' ? "bg-vibe-fire/20" : user.faction === 'ice' ? "bg-vibe-ice/20" : "bg-white/5")} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={clsx("w-32 h-32 rounded-full border-4 overflow-hidden relative bg-black transition-colors duration-500", user.faction === 'fire' ? "border-vibe-fire/30" : user.faction === 'ice' ? "border-vibe-ice/30" : "border-gray-500/30")}>
                <img src={user.avatar} className="w-full h-full object-cover" />
                {editMode && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="text-white opacity-80" />
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={onFileChange} accept="image/*" />
            </div>

            <div className="flex-1 text-center md:text-left w-full max-w-lg">
              {editMode ? (
                <div className="space-y-4 relative">
                    <div className="relative">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Username</label>
                        <input value={tempUsername} onChange={e => setTempUsername(e.target.value)} placeholder="Username" maxLength={20} className="bg-black/30 border border-white/20 rounded-xl px-4 py-2 text-xl font-bold text-white w-full focus:border-vibe-fire outline-none pr-12" />
                        <span className={clsx("absolute right-3 top-9 text-[10px] font-mono", tempUsername.length >= 20 ? "text-red-500" : "text-gray-600")}>{tempUsername.length}/20</span>
                    </div>
                    <div className="relative emoji-picker-container">
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Bio</label>
                        <div className="relative">
                             <textarea ref={bioInputRef} value={tempBio} onChange={e => setTempBio(e.target.value)} placeholder="Your bio..." maxLength={100} className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-sm text-gray-300 w-full resize-none h-24 focus:border-vibe-fire outline-none pr-8" />
                            <span className={clsx("absolute right-10 bottom-3 text-[10px] font-mono", tempBio.length >= 100 ? "text-red-500" : "text-gray-600")}>{tempBio.length}/100</span>
                            <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={clsx("absolute right-3 bottom-3 hover:text-white transition-colors", showEmojiPicker ? "text-vibe-fire" : "text-gray-500")}><Smile size={18} /></button>
                        </div>
                        <AnimatePresence>{showEmojiPicker && (<motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10 }} className="absolute top-full right-0 mt-2 z-50 shadow-2xl rounded-xl overflow-hidden border border-white/10 bg-[#151725]"><EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} width={320} height={350} searchDisabled={false} lazyLoadEmojis={true} /></motion.div>)}</AnimatePresence>
                    </div>
                </div>
              ) : (
                <>
                    <h1 className="text-3xl font-bold text-white mb-1 flex items-center justify-center md:justify-start gap-2">{user.username}<span className={clsx("px-2 py-0.5 rounded text-[10px] uppercase font-bold border", user.faction === 'fire' ? "text-vibe-fire border-vibe-fire bg-orange-900/20" : user.faction === 'ice' ? "text-vibe-ice border-vibe-ice bg-cyan-900/20" : "text-gray-400 border-gray-500 bg-white/5")}>{user.faction}</span></h1>
                    <p className="text-sm text-gray-500 font-mono mb-4">{user.handle}</p>
                    <p className="text-gray-300 max-w-md italic leading-relaxed">"{user.bio}"</p>
                </>
              )}
            </div>

            <div className="flex gap-6">
              <div className="text-center p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Points</div>
                <div className="text-2xl font-mono font-bold text-white relative">
                    {/* 🌟 防御性显示 */}
                    {(user.points || 0).toLocaleString()}
                    <AnimatePresence>{pointsAnim && (<motion.div initial={{opacity:1, y:0}} animate={{opacity:0, y:-20}} className="absolute -top-4 right-0 text-sm text-red-500">{pointsAnim}</motion.div>)}</AnimatePresence>
                </div>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-2xl border border-white/5">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Vibe Score</div>
                <div className={clsx("text-2xl font-mono font-bold transition-colors duration-500", user.faction === 'fire' ? "text-vibe-fire" : user.faction === 'ice' ? "text-vibe-ice" : "text-white")}>{user.vibeScore}</div>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            {editMode ? (<><button onClick={() => { setEditMode(false); setShowEmojiPicker(false); }} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><X size={18} /></button><button onClick={saveProfile} className="p-2 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"><Save size={18} /></button></>) : (<button onClick={() => { setEditMode(true); }} className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"><Settings size={18} /></button>)}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
          <button onClick={() => setActiveTab('vibes')} className={clsx("pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap", activeTab === 'vibes' ? "text-white border-vibe-fire" : "text-gray-500 border-transparent hover:text-gray-300")}><Grid size={16} /> My Vibes</button>
          <button onClick={() => setActiveTab('shop')} className={clsx("pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap", activeTab === 'shop' ? "text-white border-vibe-ice" : "text-gray-500 border-transparent hover:text-gray-300")}><ShoppingBag size={16} /> Points Shop</button>
          <button onClick={() => setActiveTab('settings')} className={clsx("pb-3 text-sm font-bold flex items-center gap-2 transition-all border-b-2 whitespace-nowrap", activeTab === 'settings' ? "text-white border-gray-500" : "text-gray-500 border-transparent hover:text-gray-300")}><Settings size={16} /> Security</button>
        </div>

        <div>
          {/* Tab 1: Vibes */}
          {activeTab === 'vibes' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myCards.length > 0 ? (
                    myCards.map(card => (
                        <div key={card.id} className="relative">
                           <VibeCard data={card} isOwner={true} onDelete={handleDeleteCard} onTogglePrivacy={handleTogglePrivacy} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-20 text-gray-500 italic">No vibes emitted yet. Start creating!</div>
                )}
             </div>
          )}

          {/* Tab 2: Shop */}
          {activeTab === 'shop' && (
              <div className="max-w-md mx-auto">
                  {SHOP_ITEMS.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors relative overflow-hidden group">
                          <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", item.color === "text-vibe-fire" ? "bg-vibe-fire" : "bg-white")} />
                          <div className={clsx("w-20 h-20 rounded-full bg-black/50 flex items-center justify-center mb-4 border border-white/5", item.color)}>
                              <item.icon size={40} />
                          </div>
                          <h3 className="font-bold text-white text-xl mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500 text-center mb-6">{item.desc}</p>
                          <button onClick={() => handleItemClick(item)} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold transition-colors border border-white/5 cursor-pointer z-10">Open Console</button>
                      </div>
                  ))}
              </div>
          )}

          {/* Tab 3: Security */}
          {activeTab === 'settings' && (
              <div className="max-w-xl mx-auto space-y-6">
                  {/* ... Security Content (保持不变) ... */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Key size={20} className="text-vibe-ice" /> Password Update</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Current Password</label>
                              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" className="w-full bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-white focus:border-vibe-ice outline-none transition-colors" />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Email Verification</label>
                              <div className="flex gap-2">
                                <input type="text" value={emailCode} onChange={e => setEmailCode(e.target.value)} placeholder="Enter 4-digit code" disabled={!isCodeSent} className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-white focus:border-vibe-ice outline-none transition-colors disabled:opacity-50" />
                                <button onClick={sendCode} disabled={isCodeSent || !currentPassword} className="px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap">{isCodeSent ? "Sent!" : "Get Code"}</button>
                              </div>
                              <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1"><Mail size={10} /> code will be sent to {user.email}</p>
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 uppercase font-bold block mb-1">New Password</label>
                              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" disabled={!isCodeSent} className="w-full bg-black/30 border border-white/10 rounded px-3 py-3 text-sm text-white focus:border-vibe-ice outline-none transition-colors disabled:opacity-50" />
                          </div>
                          <button onClick={updatePassword} disabled={!isCodeSent || !newPassword} className="w-full py-3 bg-vibe-ice/20 text-vibe-ice border border-vibe-ice/50 rounded hover:bg-vibe-ice/30 transition-colors font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed mt-2">Confirm Change</button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Transmutation Console Modal */}
      <AnimatePresence>{showTransmuteModal && (<div className="fixed inset-0 z-[7000] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowTransmuteModal(false)} /><motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#151725] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"><button onClick={() => setShowTransmuteModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button><div className="text-center mb-6"><h2 className="text-xl font-bold text-white mb-1">Energy Transmutation</h2><p className="text-xs text-gray-500">Inject raw energy into the system.</p></div><div className="grid grid-cols-2 gap-4 mb-6"><button onClick={() => setTargetFaction('fire')} className={clsx("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", targetFaction === 'fire' ? "bg-vibe-fire/10 border-vibe-fire text-vibe-fire" : "bg-black/30 border-white/5 text-gray-500 hover:bg-white/5")}><Flame size={24} className={targetFaction === 'fire' ? "mb-2 fill-vibe-fire" : "mb-2"} /><span className="text-xs font-bold uppercase">Inject Fire</span></button><button onClick={() => setTargetFaction('ice')} className={clsx("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", targetFaction === 'ice' ? "bg-vibe-ice/10 border-vibe-ice text-vibe-ice" : "bg-black/30 border-white/5 text-gray-500 hover:bg-white/5")}><Snowflake size={24} className={targetFaction === 'ice' ? "mb-2 fill-vibe-ice" : "mb-2"} /><span className="text-xs font-bold uppercase">Inject Ice</span></button></div><div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5 flex items-center justify-between"><div className="text-left"><div className="text-[10px] text-gray-500 uppercase font-bold">Cost</div><div className="text-xl font-mono font-bold text-white">{transmuteAmount.toLocaleString()} <span className="text-xs text-gray-500">PTS</span></div></div><ArrowRight className="text-gray-600" /><div className="text-right"><div className="text-[10px] text-gray-500 uppercase font-bold">Force</div><div className={clsx("text-xl font-mono font-bold", targetFaction === 'fire' ? "text-vibe-fire" : "text-vibe-ice")}>{targetFaction === 'fire' ? '+' : '-'}{Math.floor(transmuteAmount / EXCHANGE_RATE)} <span className="text-xs text-gray-500">VIBE</span></div></div></div><div className="mb-8"><div className="flex justify-between text-xs text-gray-400 mb-2 font-mono"><span>100</span><span>{user.points.toLocaleString()} PTS</span></div><input type="range" min="100" max={user.points} step={100} value={transmuteAmount} onChange={(e) => setTransmuteAmount(Number(e.target.value))} className={clsx("w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700", targetFaction === 'fire' ? "accent-vibe-fire" : "accent-vibe-ice")} /></div><button onClick={executeTransmute} disabled={user.points < 100} className={clsx("w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 text-black", user.points < 100 ? "bg-gray-800 text-gray-500 cursor-not-allowed" : targetFaction === 'fire' ? "bg-vibe-fire hover:bg-orange-500 shadow-orange-900/40 text-white" : "bg-vibe-ice hover:bg-cyan-300 shadow-cyan-900/40")}>{user.points < 100 ? "Not enough points" : "Transmute"}</button></motion.div></div>)}</AnimatePresence>

      {/* Avatar Cropper Modal (保持不变，省略) */}
      {isCropping && avatarSrc && (<div className="fixed inset-0 z-[6000] bg-black/90 flex flex-col items-center justify-center p-4"><div className="relative w-full max-w-md h-[400px] bg-black border border-white/20 rounded-xl overflow-hidden mb-6"><Cropper image={avatarSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} /></div><div className="flex gap-4 w-full max-w-md justify-center"><button onClick={() => { setIsCropping(false); setAvatarSrc(null); }} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Cancel</button><button onClick={saveAvatar} className="flex-1 py-3 bg-vibe-fire text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">Save Looks</button></div></div>)}
    </main>
  );
}