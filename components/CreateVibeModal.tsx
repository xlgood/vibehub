"use client";

import { useState, useRef, useCallback } from "react";
import { X, Image as ImageIcon, Sparkles, Send, Crop as CropIcon, Smile, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import Cropper from "react-easy-crop"; 
import getCroppedImg from "@/utils/canvasUtils"; 
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react"; 

interface CreateVibeModalProps {
  onClose: () => void;
  onPublish: (data: { title: string; content: string; image: string }) => void;
}

export default function CreateVibeModal({ onClose, onPublish }: CreateVibeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // === 图片裁剪状态 ===
  const [imageSrc, setImageSrc] = useState<string | null>(null); 
  const [croppedImage, setCroppedImage] = useState<string | null>(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false); 

  // === 表情包状态 ===
  const [showEmojiPicker, setShowEmojiPicker] = useState<'title' | 'content' | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === 1. 图片上传处理 ===
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true); 
        setCroppedImage(null); // 上传新图时，清空之前的裁剪结果
        setErrorMsg(null); // 清除可能存在的图片错误提示
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImageBase64);
      setIsCropping(false); 
      setErrorMsg(null);
    } catch (e) {
      console.error(e);
    }
  };

  const useRandomImage = () => {
    const randomUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400/600`;
    setCroppedImage(randomUrl); 
    setImageSrc(null);
    setIsCropping(false);
    setErrorMsg(null);
  };

  // === 2. 表情包处理 ===
  const onEmojiClick = (emojiData: EmojiClickData, target: 'title' | 'content') => {
    const emoji = emojiData.emoji;
    if (target === 'title') {
      const input = titleInputRef.current;
      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const newValue = title.substring(0, start) + emoji + title.substring(end);
        setTitle(newValue);
        setTimeout(() => input.focus(), 0);
      } else {
        setTitle(prev => prev + emoji);
      }
    } else {
      const textarea = contentInputRef.current;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const newValue = content.substring(0, start) + emoji + content.substring(end);
        setContent(newValue);
        setTimeout(() => textarea.focus(), 0);
      } else {
        setContent(prev => prev + emoji);
      }
    }
    setShowEmojiPicker(null);
  };

  // === 3. 严格验证逻辑 ===
  const validateContent = () => {
    // 1. 检查标题 (必填)
    if (!title.trim()) {
        setErrorMsg("Title is missing. Give your vibe a name.");
        return false;
    }
    if (title.length > 50) {
      setErrorMsg("Title is too long (max 50 chars).");
      return false;
    }

    // 2. 检查内容 (必填)
    if (!content.trim()) {
        setErrorMsg("Payload is missing. Say something.");
        return false;
    }
    if (content.length > 280) {
      setErrorMsg("Content is too long (max 280 chars).");
      return false;
    }

    // 3. 检查图片 (必填)
    if (isCropping) {
        setErrorMsg("Please finish editing your image (Click Done).");
        return false;
    }
    if (!croppedImage) {
        setErrorMsg("Visuals are required. Upload an image or use Random.");
        return false;
    }

    setErrorMsg(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validateContent()) return;
    
    // 如果验证通过，croppedImage 一定有值
    setIsSubmitting(true);
    
    setTimeout(() => {
      onPublish({ 
          title: title.trim(), 
          content: content.trim(), 
          image: croppedImage! // 断言非空
      });
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-4xl bg-[#151725] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px]"
        onClick={(e) => {
            e.stopPropagation();
            setShowEmojiPicker(null); 
        }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-white/10 text-white transition-colors">
          <X size={20} />
        </button>

        {/* === 左侧：图片编辑区 === */}
        <div className="w-full md:w-5/12 bg-black/50 relative group flex flex-col h-1/3 md:h-full border-b md:border-b-0 md:border-r border-white/5">
          
          {imageSrc && isCropping ? (
            <div className="relative w-full h-full bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4} 
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
              <div className="absolute bottom-4 left-0 w-full px-4 flex gap-2 justify-center z-10">
                <input 
                  type="range" min={1} max={3} step={0.1} value={zoom} 
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <button 
                    onClick={showCroppedImage}
                    className="px-3 py-1 bg-vibe-fire text-white text-xs font-bold rounded-full shadow-lg"
                >
                    Done
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
              {croppedImage ? (
                 <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${croppedImage})` }} />
              ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                    <ImageIcon size={48} className="opacity-20" />
                    <span className="text-xs uppercase tracking-widest opacity-40">No Image Selected</span>
                 </div>
              )}

              <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3">
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
                 >
                   <Upload size={14} /> Upload
                 </button>
                 <button 
                    onClick={useRandomImage}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
                 >
                   <Sparkles size={14} className="text-vibe-fire" /> Random
                 </button>
                 {imageSrc && (
                    <button 
                        onClick={() => setIsCropping(true)}
                        className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95"
                    >
                        <CropIcon size={14} /> Edit
                    </button>
                 )}
              </div>
              <input 
                type="file" accept="image/*" 
                ref={fileInputRef} 
                onChange={onFileChange} 
                className="hidden" 
              />
            </div>
          )}
        </div>

        {/* === 右侧：内容编辑区 === */}
        <div className="flex-1 p-6 flex flex-col relative h-2/3 md:h-full overflow-y-auto no-scrollbar">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-vibe-fire">Emit</span> New Vibe
          </h2>

          <div className="space-y-6 flex-grow">
            
            {/* 标题输入 (必填) */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                {/* 🌟 这里的 Label 已经加上了星号 */}
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Title *</label>
                <span className={clsx("text-[10px] font-mono", title.length >= 50 ? "text-red-500" : "text-gray-600")}>
                    {title.length}/50
                </span>
              </div>
              <div className="relative">
                <input 
                    ref={titleInputRef}
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                    placeholder="e.g. Cyberpunk Dreams"
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:border-vibe-ice/50 focus:ring-1 focus:ring-vibe-ice/50 outline-none transition-all"
                />
                <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiPicker(showEmojiPicker === 'title' ? null : 'title');
                    }}
                >
                    <Smile size={18} />
                </button>
                {showEmojiPicker === 'title' && (
                    <div className="absolute right-0 top-12 z-50 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <EmojiPicker 
                            theme={Theme.DARK} 
                            onEmojiClick={(data) => onEmojiClick(data, 'title')}
                            width={300}
                            height={350}
                        />
                    </div>
                )}
              </div>
            </div>

            {/* 内容输入 (必填) */}
            <div className="flex-grow flex flex-col relative">
               <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Payload *</label>
                <span className={clsx("text-[10px] font-mono", content.length >= 280 ? "text-red-500" : "text-gray-600")}>
                    {content.length}/280
                </span>
              </div>
              <div className="relative flex-grow flex">
                <textarea 
                    ref={contentInputRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 280))}
                    placeholder="What energy are you sending out?"
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:border-vibe-fire/50 focus:ring-1 focus:ring-vibe-fire/50 outline-none transition-all resize-none h-40 md:h-auto"
                />
                <button 
                    className="absolute right-3 top-3 text-gray-500 hover:text-yellow-400 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiPicker(showEmojiPicker === 'content' ? null : 'content');
                    }}
                >
                    <Smile size={18} />
                </button>
                 {showEmojiPicker === 'content' && (
                    <div className="absolute right-0 top-12 z-50 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <EmojiPicker 
                            theme={Theme.DARK} 
                            onEmojiClick={(data) => onEmojiClick(data, 'content')}
                            width={300}
                            height={350}
                        />
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* 错误信息提示 */}
          {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2 animate-pulse">
                  <span className="font-bold">⚠️</span> {errorMsg}
              </div>
          )}

          {/* 底部操作栏 */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-[10px] text-gray-500 hidden sm:block">
              Daily First Post: <span className="text-vibe-fire font-bold">+50 PTS</span>
            </span>
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={clsx(
                "w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                isSubmitting 
                  ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-vibe-fire to-orange-600 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95"
              )}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Publish <Send size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}