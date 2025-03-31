import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 加载中旋转器组件
 * 
 * 用于显示加载状态的旋转组件，遵循宇宙星空主题设计。
 * 
 * @param {React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof spinnerVariants>} props - 组件属性
 * @returns {React.ReactElement} 渲染后的旋转器组件
 */
const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-current border-solid border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
        xl: "h-12 w-12 border-4",
      },
      variant: {
        default: "text-blue-400",
        primary: "text-blue-500",
        secondary: "text-purple-500",
        success: "text-green-500",
        danger: "text-red-500",
        warning: "text-yellow-500",
        info: "text-cyan-500",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = "加载中...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn("flex items-center justify-center", className)}
        {...props}
      >
        <div className={spinnerVariants({ size, variant })} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner }; 