"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { useVibe } from "@/context/VibeProvider";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // 🌟 成功提示状态
  const { login } = useVibe();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/"); // 🌟 登录成功跳转到首页
      }, 1000);
    } else {
        alert("Login failed. Try again."); // 简单错误提示
        setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
      e.preventDefault();
      alert("Password reset link sent to the digital void. (This is a demo)");
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vibe-fire/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#151725] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-vibe-fire/10 flex items-center justify-center mx-auto mb-4 border border-vibe-fire/20">
              <Zap size={32} className="text-vibe-fire animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Sync your frequency to the network.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@vibehub.ink" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-vibe-fire focus:ring-1 focus:ring-vibe-fire outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-xs uppercase font-bold text-gray-500">Password</label>
                {/* 🌟 Forgot Password Link */}
                <button onClick={handleForgotPassword} className="text-xs text-vibe-fire hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-vibe-fire focus:ring-1 focus:ring-vibe-fire outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-vibe-fire to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <>Connect <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an identity? 
            <Link href="/signup" className="text-white font-bold ml-1 hover:text-vibe-fire transition-colors">Initialize here</Link>
          </div>
        </div>
      </div>

      {/* 🌟 Success Toast */}
      <AnimatePresence>
        {showSuccess && (
            <motion.div 
                initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/30 backdrop-blur-md text-green-400 font-bold text-sm flex items-center gap-2"
            >
                <CheckCircle size={18} /> Connection Established. Redirecting...
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}