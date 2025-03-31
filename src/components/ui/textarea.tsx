import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 文本区域组件
 * 
 * 用于输入多行文本的组件，遵循宇宙星空主题设计。
 * 
 * @param {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - 文本区域属性
 * @returns {React.ReactElement} 渲染后的文本区域组件
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-slate-200 bg-slate-50/30 backdrop-blur-sm px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-200 dark:placeholder:text-slate-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea }; 