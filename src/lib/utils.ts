// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并并处理CSS类名
 * 使用clsx合并类名参数，并使用tailwind-merge解决冲突问题
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}