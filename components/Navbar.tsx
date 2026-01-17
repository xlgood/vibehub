"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, LogOut, User, LogIn, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVibe } from "@/context/VibeProvider";
import { clsx } from "clsx";
import Logo from "@/components/Logo";

// ... inside Navbar JSX ...
<Link href="/" className="flex items-center gap-3 group">
  <Logo className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
  <span className="text-xl font-bold tracking-tighter text-white">
    VibeCheck
  </span>
</Link>

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // 🌟 Logout 确认弹窗状态
  const { user, isLoggedIn, logout } = useVibe();
  
  // 🌟 本地 Toast 状态
  const [toast, setToast] = useState<string | null>(null);

  const handleDisconnectClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true); // 打开确认弹窗
  };

  const confirmDisconnect = () => {
    setToast("Disconnecting from neural network...");
    setTimeout(() => {
        logout();
        setShowLogoutConfirm(false);
        setToast(null);
    }, 1500);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 lg:px-12">
        {/* 1. Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Zap className="text-vibe-fire w-6 h-6 group-hover:text-vibe-ice transition-colors duration-500" />
          <span className="text-xl font-bold tracking-tighter text-white">
            Vibe<span className="text-transparent bg-clip-text bg-gradient-to-r from-vibe-fire to-vibe-ice">Hub</span>
          </span>
        </Link>
        
        {/* 2. Nav Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <Link href="/" className="text-white hover:text-vibe-fire transition-colors">Feed</Link>
          <Link href="/leaderboard" className="hover:text-vibe-ice transition-colors">Leaderboard</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>

        {/* 3. User Status */}
        <div className="flex items-center gap-4">
          
          {isLoggedIn && user ? (
            <>
              {/* Points Pill */}
              <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-white/20 transition-colors cursor-help" title="Your Points">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">PTS</span>
                <span className="text-sm font-mono font-bold text-white">
                  {user.points.toLocaleString()}
                </span>
              </div>
              
              {/* User Avatar & Dropdown */}
              <div className="relative">
                <div 
                  className="w-9 h-9 rounded-full bg-gray-800 cursor-pointer overflow-hidden transition-transform hover:scale-105 ring-2 ring-transparent hover:ring-white/20"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                </div>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-12 w-48 bg-[#151725] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col py-1"
                      >
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} />
                          <span>My Profile</span>
                        </Link>
                        <div className="h-[1px] bg-white/5 my-1" />
                        <button 
                          onClick={handleDisconnectClick}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left w-full"
                        >
                          <LogOut size={16} />
                          <span>Disconnect</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/5"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* 🌟 Custom Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#151725] border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20">
                  <LogOut size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Disconnect?</h3>
                <p className="text-sm text-gray-400 mb-6">
                  You are about to jack out of the VibeHub network.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold text-sm transition-colors"
                  >
                    Stay Connected
                  </button>
                  <button 
                    onClick={confirmDisconnect}
                    className="flex-1 py-3 rounded-xl bg-red-600/20 text-red-500 border border-red-600/50 hover:bg-red-600 hover:text-white font-bold text-sm transition-all shadow-lg shadow-red-900/20"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌟 Disconnect Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-bold text-sm flex items-center gap-2"
          >
            <AlertTriangle size={16} className="text-yellow-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}