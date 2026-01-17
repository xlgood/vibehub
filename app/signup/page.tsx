"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Lock, Mail, User, Loader2, Flame, Snowflake } from "lucide-react";
import { useVibe } from "@/context/VibeProvider";
import Navbar from "@/components/Navbar";
import { clsx } from "clsx";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [faction, setFaction] = useState<'fire' | 'ice'>('fire');
  
  const [loading, setLoading] = useState(false);
  const { signup } = useVibe();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 调用全局注册
    await signup({ username, faction });
    
    router.push("/profile");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden py-20">
        <div className={clsx("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] blur-[150px] rounded-full pointer-events-none transition-colors duration-1000", faction === 'fire' ? "bg-vibe-fire/10" : "bg-vibe-ice/10")} />

        <div className="w-full max-w-md bg-[#151725] border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Initialize ID</h1>
            <p className="text-gray-500 text-sm">Create your digital avatar.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Input Fields */}
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="NeonDrifter"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@vibehub.ink"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Faction Selector */}
            <div className="pt-4">
              <label className="text-xs uppercase font-bold text-gray-500 ml-1 block mb-2">Choose Initial Resonance</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFaction('fire')}
                  className={clsx(
                    "flex flex-col items-center p-4 rounded-xl border-2 transition-all",
                    faction === 'fire' ? "bg-vibe-fire/20 border-vibe-fire text-vibe-fire" : "bg-black/40 border-white/5 text-gray-500 hover:bg-white/5"
                  )}
                >
                  <Flame size={24} className="mb-2" />
                  <span className="text-xs font-bold">FIRE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFaction('ice')}
                  className={clsx(
                    "flex flex-col items-center p-4 rounded-xl border-2 transition-all",
                    faction === 'ice' ? "bg-vibe-ice/20 border-vibe-ice text-vibe-ice" : "bg-black/40 border-white/5 text-gray-500 hover:bg-white/5"
                  )}
                >
                  <Snowflake size={24} className="mb-2" />
                  <span className="text-xs font-bold">ICE</span>
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={clsx(
                "w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6 active:scale-95",
                faction === 'fire' ? "bg-vibe-fire hover:bg-orange-600 shadow-orange-900/20" : "bg-vibe-ice text-black hover:bg-cyan-400 shadow-cyan-900/20"
              )}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Establish Connection"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already connected? 
            <Link href="/login" className="text-white font-bold ml-1 hover:text-white transition-colors">
              Login here
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}