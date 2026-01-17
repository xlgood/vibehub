"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md pt-12 pb-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left: Brand & Copyright */}
        <div className="text-center md:text-left">
          <Link href="/" className="flex items-center justify-center md:justify-start gap-2 mb-2 group">
            <Zap className="text-vibe-fire w-5 h-5 group-hover:text-vibe-ice transition-colors" />
            <span className="font-bold text-lg text-white tracking-tighter">VibeHub</span>
          </Link>
          <p className="text-xs text-gray-500">
            © {currentYear} VibeHub Inc. All vibes reserved.
          </p>
          <p className="text-[10px] text-gray-600 mt-1">
            Built for the digital void.
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Resonance</Link>
        </div>

        {/* Right: Socials */}
        <div className="flex gap-4">
          <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Twitter size={18} />
          </a>
          <a href="#" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Github size={18} />
          </a>
          <a href="mailto:contact@vibehub.ink" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}