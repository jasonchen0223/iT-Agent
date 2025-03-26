import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * 输入框组件接口
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * 输入框组件
 *
 * 基础输入框组件，支持所有HTML输入框属性
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-700 bg-slate-800/60 px-3 py-2 text-sm ring-offset-slate-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
