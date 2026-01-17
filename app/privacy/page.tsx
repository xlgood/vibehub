"use client";

import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Protocol</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. The Vibe Data</h2>
            <p>We collect the energy you emit (posts) and the resonance you create (votes). This data is used to calculate the global Vibe Temperature.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Identity Protection</h2>
            <p>Your digital avatar is a mask. We do not require real names. We protect your anonymity unless you choose to reveal yourself.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. No Trackers</h2>
            <p>We do not use third-party ad trackers. The only thing following you here is your own reputation.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Deletion</h2>
            <p>You have the right to burn your data. Use the "Delete Account" function in your Profile settings to wipe your existence from our servers instantly.</p>
          </section>
          
          <div className="pt-8 border-t border-white/10 text-xs font-mono">
            Last Updated: 2026.01.16 // Protocol v1.0
          </div>
        </div>
      </div>
    </main>
  );
}