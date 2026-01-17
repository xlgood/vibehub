"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginUser, getUserById, updateProfile as updateProfileServer } from '@/app/actions';

// 定义与数据库一致的 User 接口
interface UserData {
  id: string; // 🌟 必须是 string
  username: string;
  handle: string;
  avatar: string; // 注意：Prisma Schema 里是可选的 (String?)，但这里我们尽量保证有默认值
  bio: string;
  points: number;
  vibeScore: number;
  faction: string; // 'fire' | 'ice' | 'neutral'
  email: string;
}

interface VibeContextType {
  user: UserData | null; 
  isLoggedIn: boolean;
  login: (email: string) => Promise<boolean>; // 登录只需要邮箱
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => void;
  addPoints: (amount: number) => void;
  globalVibe: 'fire' | 'ice';
  setGlobalVibe: (vibe: 'fire' | 'ice') => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [globalVibe, setGlobalVibe] = useState<'fire' | 'ice'>('fire');

  // 🌟 初始化：检查 LocalStorage 是否有 userId，如果有，去服务器查最新数据
  useEffect(() => {
    const checkSession = async () => {
      const storedUserId = localStorage.getItem('vibe_user_id');
      if (storedUserId) {
        const serverUser = await getUserById(storedUserId);
        if (serverUser) {
          // 转换 Prisma 数据为 Context 数据 (处理 null 值)
          setUser({
            ...serverUser,
            handle: serverUser.handle || `@${serverUser.username}`,
            avatar: serverUser.avatar || "",
            bio: serverUser.bio || "",
            faction: serverUser.faction || "neutral",
          });
        }
      }
    };
    checkSession();
  }, []);

  // 🌟 真实登录逻辑
  const login = async (email: string) => {
    if (!email) return false;
    
    // 调用 Server Action
    const serverUser = await loginUser(email);
    
    if (serverUser) {
      setUser({
        ...serverUser,
        handle: serverUser.handle || `@${serverUser.username}`,
        avatar: serverUser.avatar || "",
        bio: serverUser.bio || "",
        faction: serverUser.faction || "neutral",
      });
      // 简单的客户端持久化 (存 ID)
      localStorage.setItem('vibe_user_id', serverUser.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vibe_user_id');
    window.location.href = '/'; 
  };

  const updateUser = async (updates: Partial<UserData>) => {
    if (!user) return;
    
    // 乐观更新前端
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);

    // 如果涉及资料修改，同步到服务器
    if (updates.username || updates.bio) {
       await updateProfileServer(user.id, {
         username: updates.username || user.username,
         bio: updates.bio || user.bio
       });
    }
  };

  const addPoints = (amount: number) => {
    if (!user) return;
    setUser(prev => prev ? ({ ...prev, points: prev.points + amount }) : null);
  };

  return (
    <VibeContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateUser, addPoints, globalVibe, setGlobalVibe }}>
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