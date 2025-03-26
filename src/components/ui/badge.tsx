import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * 徽章变体配置
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-slate-700 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 cursor-default",
  {
    variants: {
      variant: {
        default:
          "bg-slate-800/60 text-white hover:bg-slate-700/70 border-slate-700",
        primary:
          "bg-indigo-900/30 text-indigo-300 border-indigo-700 hover:bg-indigo-800/40",
        secondary:
          "bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-700/70",
        destructive:
          "bg-red-900/30 text-red-300 border-red-700 hover:bg-red-800/40",
        success:
          "bg-green-900/30 text-green-300 border-green-700 hover:bg-green-800/40",
        warning:
          "bg-amber-900/30 text-amber-300 border-amber-700 hover:bg-amber-800/40",
        info: "bg-blue-900/30 text-blue-300 border-blue-700 hover:bg-blue-800/40",
        outline: "text-slate-300 border-slate-700 hover:bg-slate-700/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * 徽章组件接口
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * 徽章组件
 *
 * 用于显示状态、计数或标签的小型组件
 *
 * @param {BadgeProps} props - 徽章组件属性
 * @returns {React.ReactElement} 徽章组件
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
