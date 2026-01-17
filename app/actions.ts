"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- 用户 Actions ---

export async function loginUser(email: string) {
  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const username = email.split('@')[0];
      user = await prisma.user.create({
        data: {
          email,
          username: username,
          handle: `@${username}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          bio: "Just joined the VibeHub network.",
          faction: "neutral",
        },
      });
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
}

export async function updateProfile(userId: string, data: { username: string; bio: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { username: data.username, bio: data.bio },
    });
    revalidatePath('/profile');
    return user;
  } catch (error) {
    return null;
  }
}

// 🌟 新增：获取排行榜数据
export async function getLeaderboard() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { vibeScore: 'desc' },
      take: 50,
    });
    // 转换成前端需要的格式 (如果字段有差异)
    return users.map(u => ({
      id: u.id,
      name: u.username,
      handle: u.handle,
      vibeScore: u.vibeScore,
      avatar: u.avatar || "",
      faction: u.faction as 'fire' | 'ice' | 'neutral',
    }));
  } catch (error) {
    return [];
  }
}

// 🌟 新增：获取特定用户的公开主页数据
export async function getUserProfileData(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    const vibes = await prisma.vibe.findMany({
      where: { authorId: userId, visibility: 'public' },
      orderBy: { createdAt: 'desc' },
    });

    return {
      user,
      vibes: vibes.map(v => ({
        id: v.id,
        title: v.title,
        content: v.content,
        image: v.image,
        author: user.handle, // 使用 handle
        avatar: user.avatar || "",
        initialBoost: v.boostCount,
        initialChill: v.chillCount,
        timestamp: v.createdAt.getTime(),
        visibility: 'public' as const
      }))
    };
  } catch (error) {
    return null;
  }
}

// 🌟 新增：获取“我”的所有卡片（包括私密）
export async function getMyVibes(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    const vibes = await prisma.vibe.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });

    return vibes.map(v => ({
      id: v.id,
      title: v.title,
      content: v.content,
      image: v.image,
      author: user.username,
      avatar: user.avatar || "",
      initialBoost: v.boostCount,
      initialChill: v.chillCount,
      timestamp: v.createdAt.getTime(),
      visibility: v.visibility as 'public' | 'private'
    }));
  } catch (error) {
    return [];
  }
}

// --- Vibe Actions ---

export async function getVibes(filter: 'latest' | 'trending' = 'latest') {
  try {
    const vibes = await prisma.vibe.findMany({
      where: { visibility: 'public' },
      orderBy: filter === 'latest' ? { createdAt: 'desc' } : { boostCount: 'desc' },
      take: 50,
      include: { author: true },
    });

    return vibes.map(v => ({
      id: v.id,
      title: v.title,
      content: v.content,
      image: v.image,
      author: v.author.handle,
      avatar: v.author.avatar || "",
      initialBoost: v.boostCount,
      initialChill: v.chillCount,
      timestamp: v.createdAt.getTime(),
      visibility: v.visibility as 'public' | 'private',
    }));
  } catch (error) {
    return [];
  }
}

export async function createVibe(userId: string, data: { title: string; content: string; image: string; visibility: string }) {
  try {
    await prisma.vibe.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        visibility: data.visibility,
        authorId: userId,
      },
    });
    // 加分
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 50 } }
    });
    revalidatePath('/');
    revalidatePath('/profile');
    return true;
  } catch (error) {
    return false;
  }
}

export async function voteVibe(userId: string, vibeId: string, type: 'boost' | 'chill') {
  try {
    const existingVote = await prisma.vote.findUnique({
      where: { userId_vibeId: { userId, vibeId } }
    });

    if (existingVote) {
      if (existingVote.type === type) return { success: false };
      await prisma.vote.delete({ where: { id: existingVote.id } });
      const decrementField = existingVote.type === 'boost' ? 'boostCount' : 'chillCount';
      await prisma.vibe.update({ where: { id: vibeId }, data: { [decrementField]: { decrement: 1 } } });
    }

    await prisma.vote.create({ data: { userId, vibeId, type } });
    const incrementField = type === 'boost' ? 'boostCount' : 'chillCount';
    await prisma.vibe.update({ where: { id: vibeId }, data: { [incrementField]: { increment: 1 } } });
    
    await prisma.user.update({
      where: { id: userId },
      data: { 
        points: { increment: 10 },
        faction: type === 'boost' ? 'fire' : 'ice' 
      }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}