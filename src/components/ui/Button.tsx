"use client";

// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "tool";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
          // 各种变体样式
          {
            "bg-indigo-600 text-white hover:bg-indigo-700":
              variant === "default",
            "border border-indigo-500 text-indigo-100 hover:bg-indigo-700/20":
              variant === "outline",
            "text-indigo-100 hover:bg-indigo-700/20": variant === "ghost",
            "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700":
              variant === "tool",
          },
          // 各种尺寸
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-6 text-lg": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          // 改进禁用状态样式
          {
            "opacity-50 cursor-not-allowed hover:!bg-indigo-600 hover:!from-purple-600 hover:!to-indigo-600 hover:!bg-none":
              props.disabled,
          },
          className,
        )}
        ref={ref}
        {...props}
        data-oid="w.77:bi"
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
