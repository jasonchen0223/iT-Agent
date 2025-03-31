import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 警告提示组件
 * 
 * 用于显示重要信息和提示的组件，遵循宇宙星空主题设计。
 * 
 * @param {React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>} props - 警告提示属性
 * @returns {React.ReactElement} 渲染后的警告提示组件
 */
const alertVariants = cva(
  "relative w-full rounded-lg border backdrop-blur-sm p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-slate-800/60 text-slate-200 border-slate-700 dark:bg-slate-950/80 dark:text-slate-300 dark:border-slate-800",
        destructive:
          "border-red-500/50 bg-red-900/20 text-red-400 dark:border-red-900/50 dark:bg-red-900/30 [&>svg]:text-red-400",
        success:
          "border-green-500/50 bg-green-900/20 text-green-400 dark:border-green-900/50 dark:bg-green-900/30 [&>svg]:text-green-400",
        warning:
          "border-yellow-500/50 bg-yellow-900/20 text-yellow-400 dark:border-yellow-900/50 dark:bg-yellow-900/30 [&>svg]:text-yellow-400",
        info:
          "border-blue-500/50 bg-blue-900/20 text-blue-400 dark:border-blue-900/50 dark:bg-blue-900/30 [&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription }; 