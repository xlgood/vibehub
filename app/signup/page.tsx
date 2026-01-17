"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, ArrowRight, Loader2, CheckCircle, User } from "lucide-react";
import { useVibe } from "@/context/VibeProvider";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function SignupPage() {
  // 我们其实不需要复杂的注册表单了，因为 Login 已经包含了自动注册
  // 这里我们复用 Login 的逻辑，但文案换成 Sign Up 风格
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 🌟 修复：使用 login 而不是不存在的 signup
  const { login } = useVibe();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 调用 login (会自动处理注册)
    const success = await login(email);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      setLoading(false);
      alert("Connection failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vibe-ice/20 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md bg-[#151725]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-vibe-ice text-white mb-4 shadow-lg shadow-purple-900/30">
              <User size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Join the Network</h1>
            <p className="text-gray-400 text-sm">Create your digital identity instantly.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1">Email Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="new_user@vibehub.net"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-white/30 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || showSuccess}
              className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {showSuccess ? (
                <><CheckCircle size={20} className="text-green-600" /> Account Created</>
              ) : loading ? (
                <><Loader2 size={20} className="animate-spin" /> Initializing...</>
              ) : (
                <>Sign Up <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
             <button onClick={() => router.push('/login')} className="text-xs text-gray-500 hover:text-white transition-colors">
                Already have an identity? Login
             </button>
          </div>

        </motion.div>
      </div>
    </main>
  );
}