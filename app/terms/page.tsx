"use client";

import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#050505]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Resonance</h1>
          <p className="text-sm text-gray-500 font-mono">Effective Date: 2026.01.16 // Protocol v1.0</p>
        </div>
        
        <div className="space-y-12 text-gray-400 leading-relaxed">
          
          {/* 1. Acceptance */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">01.</span> Connection Protocol
            </h2>
            <p>
              By accessing VibeHub (the "System"), you agree to sync your digital signature with these Terms of Resonance. If you do not agree, please disconnect immediately.
            </p>
          </section>

          {/* 2. User Conduct */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">02.</span> Vibe Etiquette
            </h2>
            <p className="mb-4">
              To maintain the integrity of the global energy field, the following "Disharmonic Behaviors" are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-gray-600">
              <li><strong>Spamming:</strong> Flooding the feed with low-energy noise.</li>
              <li><strong>Hate Speech:</strong> Emitting toxic frequencies targeting identity, race, or belief.</li>
              <li><strong>Manipulation:</strong> Using bots or scripts to artificially inflate Boost/Chill counts.</li>
              <li><strong>Doxing:</strong> Revealing the true identity of any masked user without consent.</li>
            </ul>
          </section>

          {/* 3. Content Ownership */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">03.</span> Signal Ownership
            </h2>
            <p>
              You retain full ownership of the vibes (content) you emit. However, by broadcasting to the System, you grant Vibehub a non-exclusive, worldwide license to display, distribute, and resonate your content across the network.
            </p>
          </section>

          {/* 4. Points & Virtual Goods */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">04.</span> Virtual Energy
            </h2>
            <p>
              "Points", "Vibe Score", and faction items have no real-world monetary value. They represent your digital influence only. The System Administrators reserve the right to adjust economy balance (inflation/deflation) at any time to preserve platform health.
            </p>
          </section>

          {/* 5. Termination */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">05.</span> Forced Disconnection
            </h2>
            <p>
              We reserve the right to terminate your connection (ban account) if you violate these terms. In extreme cases of Disharmonic Behavior, your digital avatar and all associated data may be permanently purged from the server.
            </p>
          </section>

          {/* 6. Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-vibe-fire">06.</span> System Stability
            </h2>
            <p>
              The System is provided "as is". We do not guarantee that the vibe will always be good, nor do we guarantee 100% uptime. Navigate the digital void at your own risk.
            </p>
          </section>

          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-sm">
              End of Line. <span className="text-vibe-fire">Stay Resonant.</span>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}