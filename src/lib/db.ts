/**
 * Prisma客户端单例
 * 
 * 提供全局数据库访问实例
 */
import { PrismaClient } from '@prisma/client'

// 添加Prisma客户端到NodeJS全局对象上
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 创建全局唯一的Prisma客户端实例
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

// 仅在非生产环境中将prisma挂载到全局变量
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 