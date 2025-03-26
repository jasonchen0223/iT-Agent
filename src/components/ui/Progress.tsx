// components/ui/Progress.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "error";
  animate?: boolean;
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  showValue = false,
  size = "md",
  color = "default",
  animate = true,
}: ProgressProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animate) {
      // 添加动画效果
      const interval = setInterval(() => {
        setDisplayValue((prev) => {
          if (prev < value) {
            return Math.min(prev + 1, value);
          }
          if (prev > value) {
            return Math.max(prev - 1, value);
          }
          return prev;
        });
      }, 5);

      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  // 计算进度百分比
  const percent = (Math.min(Math.max(0, displayValue), max) / max) * 100;

  // 确定高度
  const getHeight = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "lg":
        return "h-4";
      default:
        return "h-2.5";
    }
  };

  // 确定颜色
  const getColor = () => {
    switch (color) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-indigo-500";
    }
  };

  return (
    <div className="relative" data-oid=".gtt1ow">
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-indigo-900/20",
          getHeight(),
          className,
        )}
        data-oid="jlvzirx"
      >
        <div
          className={cn(
            "transition-all duration-300 ease-in-out rounded-full relative",
            getHeight(),
            getColor(),
            indicatorClassName,
          )}
          style={{ width: `${percent}%` }}
          data-oid="wxan.wv"
        >
          {/* 添加闪光效果 */}
          <div className="absolute inset-0 w-full h-full" data-oid="qcysaxj">
            <div
              className={cn(
                "h-full w-[50%] animate-pulse opacity-30 bg-gradient-to-r from-transparent via-white to-transparent",
                animate && "animate-shimmer",
              )}
              data-oid="a66a7yz"
            ></div>
          </div>
        </div>
      </div>

      {showValue && (
        <span
          className="text-xs text-indigo-300/70 absolute right-0 -top-5"
          data-oid="voz_c:6"
        >
          {displayValue}/{max}
        </span>
      )}
    </div>
  );
}
