"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Flame, Snowflake, Zap, Shield, Radio } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6">
        
        {/* 1. Hero Section */}
        <section className="mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-vibe-fire mb-6"
          >
            <Radio size={12} className="animate-pulse" /> SYSTEM ONLINE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
          >
            Quantify the <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibe-fire to-vibe-ice">Vibe</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            VibeHub is a digital experiment in emotional resonance. We don't just share content; we measure its energy temperature.
          </motion.p>
        </section>

        {/* 2. Mechanics Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-orange-900/10 to-transparent border border-vibe-fire/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-32 bg-vibe-fire/10 blur-[80px] rounded-full group-hover:bg-vibe-fire/20 transition-colors" />
            <Flame className="text-vibe-fire w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Boost (Fire)</h3>
            <p className="text-gray-400">
              High energy, excitement, chaos, passion. When a post sets the digital world on fire, we Boost it. Fire Faction members thrive on intensity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-cyan-900/10 to-transparent border border-vibe-ice/20 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-32 bg-vibe-ice/10 blur-[80px] rounded-full group-hover:bg-vibe-ice/20 transition-colors" />
            <Snowflake className="text-vibe-ice w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Chill (Ice)</h3>
            <p className="text-gray-400">
              Calm, cool, collected, or cold logic. When a post brings peace or calculated truth, we Chill it. Ice Faction members value stability.
            </p>
          </motion.div>
        </section>

        {/* 3. The Rules (Contact & Privacy Summary) */}
        <section className="border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                <Zap size={18} className="text-yellow-400" /> Our Mission
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                To create a social layer where "Likes" are obsolete. We believe in the spectrum of energy, not just binary approval.
              </p>
            </div>
            
            <div>
              <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                <Shield size={18} className="text-green-400" /> Privacy Protocol
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                We are decentralized at heart. Your data is yours. We track vibes, not personal identities. See our full <a href="/privacy" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Privacy Policy</a>.
              </p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold text-white mb-4">
                <Radio size={18} className="text-purple-400" /> Contact
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                Found a glitch in the matrix?
              </p>
              <a href="mailto:system@vibehub.ink" className="text-sm font-mono text-white hover:text-vibe-fire transition-colors">
                system@vibehub.ink
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}