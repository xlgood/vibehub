"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// === 类型定义 ===
interface UserData {
  username: string;
  handle: string;
  avatar: string;
  bio: string;
  points: number;
  vibeScore: number;
  faction: 'fire' | 'ice' | 'neutral';
  email: string;
}

// === 默认模拟用户 (登录后显示的数据) ===
const MOCK_USER_DATA: UserData = {
  username: "NeonDrifter",
  handle: "@neon_drifter",
  avatar: "https://i.pravatar.cc/150?u=1",
  bio: "Chasing vibes in the digital void. 🌌",
  points: 12540,
  vibeScore: 98,
  faction: "fire",
  email: "neon@vibehub.ink"
};

interface VibeContextType {
  user: UserData | null; // 🌟 未登录时为 null
  isLoggedIn: boolean;
  login: (email: string, pass: string) => Promise<boolean>; // 模拟异步
  signup: (data: Partial<UserData>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
  addPoints: (amount: number) => void;
  globalVibe: 'fire' | 'ice';
  setGlobalVibe: (vibe: 'fire' | 'ice') => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null); // 默认未登录
  const [globalVibe, setGlobalVibe] = useState<'fire' | 'ice'>('fire');

  // 🌟 检查本地存储 (模拟持久化登录)
  useEffect(() => {
    const stored = localStorage.getItem('vibe_auth');
    if (stored === 'true') {
      setUser(MOCK_USER_DATA);
    }
  }, []);

  // === Auth Actions ===
  const login = async (email: string, pass: string) => {
    // 模拟网络延迟
    await new Promise(r => setTimeout(r, 1000));
    
    // 简单的模拟验证
    if (email && pass) {
      setUser(MOCK_USER_DATA); // 恢复模拟数据
      localStorage.setItem('vibe_auth', 'true');
      return true;
    }
    return false;
  };

  const signup = async (data: Partial<UserData>) => {
    await new Promise(r => setTimeout(r, 1500));
    
    // 创建新用户 (合并默认值)
    const newUser = { 
      ...MOCK_USER_DATA, 
      username: data.username || "NewUser",
      faction: data.faction || 'neutral',
      points: 100, // 新用户初始积分
      vibeScore: 0
    };
    setUser(newUser);
    localStorage.setItem('vibe_auth', 'true');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_auth');
    // 可以选择在这里强制跳转首页，或者由组件处理
    window.location.href = '/'; 
  };

  // === Data Actions ===
  const updateUser = (updates: Partial<UserData>) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);
  };

  const addPoints = (amount: number) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, points: prev.points + amount }) : null);
  };

  return (
    <VibeContext.Provider value={{ 
      user, 
      isLoggedIn: !!user,
      login, 
      signup, 
      logout,
      updateUser, 
      addPoints, 
      globalVibe, 
      setGlobalVibe 
    }}>
      {children}
    </VibeContext.Provider>
  );
}

export function useVibe() {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
}