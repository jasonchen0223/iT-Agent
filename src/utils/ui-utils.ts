/**
 * UI工具函数
 * 
 * 提供UI组件常用的工具函数
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并类名工具函数
 * 
 * 合并多个类名并优化Tailwind类名冲突
 * 
 * @param inputs 要合并的类名
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 