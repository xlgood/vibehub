"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- 用户相关的 Actions ---

// 简易登录/注册：如果有这个邮箱就登录，没有就自动注册
export async function loginUser(email: string) {
  try {
    // 尝试找用户
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 如果没找到，创建一个新用户 (自动注册)
    if (!user) {
      const username = email.split('@')[0];
      user = await prisma.user.create({
        data: {
          email,
          username: username,
          handle: `@${username}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, // 随机头像
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

// 更新用户信息
export async function updateProfile(userId: string, data: { username: string; bio: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        bio: data.bio,
      },
    });
    revalidatePath('/profile'); // 刷新缓存
    return user;
  } catch (error) {
    return null;
  }
}

// --- Vibe (帖子) 相关的 Actions ---

// 获取所有帖子 (Feed)
export async function getVibes(filter: 'latest' | 'trending' = 'latest') {
  try {
    const vibes = await prisma.vibe.findMany({
      orderBy: filter === 'latest' 
        ? { createdAt: 'desc' } 
        : { boostCount: 'desc' }, // Trending 简单逻辑：按 Boost 排序
      include: {
        author: true, // 联表查询作者信息
      },
    });

    // 转换数据格式以适配前端组件
    return vibes.map(v => ({
      id: v.id, // 注意：现在 id 是 String (UUID)
      title: v.title,
      content: v.content,
      image: v.image,
      author: v.author.handle,
      avatar: v.author.avatar || "",
      initialBoost: v.boostCount,
      initialChill: v.chillCount,
      timestamp: v.createdAt.getTime(), // 转为时间戳
      visibility: v.visibility as 'public' | 'private',
    }));
  } catch (error) {
    console.error("Get Vibes Error:", error);
    return [];
  }
}

// 发布新帖子
export async function createVibe(userId: string, data: { title: string; content: string; image: string; visibility: string }) {
  try {
    const newVibe = await prisma.vibe.create({
      data: {
        title: data.title,
        content: data.content,
        image: data.image,
        visibility: data.visibility,
        authorId: userId,
      },
    });
    
    // 给作者加分 (发帖 +50分)
    await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 50 } }
    });

    revalidatePath('/'); // 刷新首页
    return newVibe;
  } catch (error) {
    console.error("Create Vibe Error:", error);
    return null;
  }
}

// --- 投票相关的 Actions ---

// 核心玩法：Boost 或 Chill
export async function voteVibe(userId: string, vibeId: string, type: 'boost' | 'chill') {
  try {
    // 1. 检查是否投过票
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_vibeId: { userId, vibeId }
      }
    });

    if (existingVote) {
      // 如果已经投过票且类型一样，什么都不做 (或者可以做取消投票，这里先简化)
      if (existingVote.type === type) return { success: false, message: "Already voted" };
      
      // 如果类型不一样 (比如从 Boost 改成 Chill)，先删旧的
      await prisma.vote.delete({ where: { id: existingVote.id } });
      
      // 减少旧计数
      const decrementField = existingVote.type === 'boost' ? 'boostCount' : 'chillCount';
      await prisma.vibe.update({
        where: { id: vibeId },
        data: { [decrementField]: { decrement: 1 } }
      });
    }

    // 2. 创建新投票
    await prisma.vote.create({
      data: { userId, vibeId, type }
    });

    // 3. 增加新计数
    const incrementField = type === 'boost' ? 'boostCount' : 'chillCount';
    await prisma.vibe.update({
      where: { id: vibeId },
      data: { [incrementField]: { increment: 1 } }
    });

    // 4. 给投票者加分 (+10) 并改变阵营
    await prisma.user.update({
      where: { id: userId },
      data: { 
        points: { increment: 10 },
        faction: type === 'boost' ? 'fire' : 'ice' // 投票即改变阵营
      }
    });

    revalidatePath('/');
    return { success: true };

  } catch (error) {
    console.error("Vote Error:", error);
    return { success: false };
  }
}

// ... (保留上面的代码)

// 根据 ID 获取用户 (用于刷新页面保持登录)
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    return null;
  }
}