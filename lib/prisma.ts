import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // 开启日志，方便你在终端看到真实的 SQL 查询
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;