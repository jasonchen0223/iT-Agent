"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { createPortal } from 'react-dom'
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

import { cn } from "@/lib/utils"
import {
  ToastProps,
  ToastPosition,
  ToastType,
  useToast
} from "@/components/ui/use-toast"

/**
 * Toast变体配置
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "border-gray-700 bg-slate-800/70 text-slate-300",
        success: "border-green-700 bg-green-900/20 text-green-300",
        info: "border-blue-700 bg-blue-900/20 text-blue-300",
        warning: "border-amber-700 bg-amber-900/20 text-amber-300",
        error: "border-red-700 bg-red-900/20 text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Toast组件属性
 */
interface ToastComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  toast: ToastProps
}

/**
 * 获取Toast变体类型
 * 
 * @param {ToastType} type - Toast类型
 * @returns {string} 变体类型
 */
function getToastVariant(type?: ToastType): "default" | "success" | "info" | "warning" | "error" {
  switch (type) {
    case "success":
      return "success"
    case "info":
      return "info"
    case "warning":
      return "warning"
    case "error":
      return "error"
    default:
      return "default"
  }
}

/**
 * Toast组件
 * 
 * @param {ToastComponentProps} props - Toast组件属性
 * @returns {React.ReactElement} Toast组件
 */
function Toast({
  className,
  toast,
  ...props
}: ToastComponentProps) {
  // 处理关闭事件
  const handleDismiss = React.useCallback(() => {
    toast.onDismiss?.(toast.id)
  }, [toast])

  // 自动关闭计时器
  React.useEffect(() => {
    if (toast.duration === Infinity) {
      return
    }

    const timer = setTimeout(() => {
      handleDismiss()
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.duration, handleDismiss])

  const variant = getToastVariant(toast.type)

  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      data-toast-type={toast.type}
      {...props}
    >
      <div className="grid gap-1">
        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      {toast.action}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 rounded-md p-1 text-slate-300/50 opacity-70 transition-opacity hover:text-slate-300 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">关闭</span>
      </button>
    </div>
  )
}

/**
 * Toast视图属性
 */
interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<"div"> {
  position?: ToastPosition
}

/**
 * Toast视图组件
 * 
 * @param {ToastViewportProps} props - Toast视图属性
 * @returns {React.ReactElement} Toast视图组件
 */
function ToastViewport({
  position = "bottom-right",
  className,
  ...props
}: ToastViewportProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  }

  return (
    <div
      className={cn(
        "fixed z-[100] flex max-h-screen flex-col-reverse p-4 gap-2 sm:max-w-[420px]",
        positionClasses[position],
        className
      )}
      {...props}
    />
  )
}

/**
 * Toast通知组件
 * 
 * 用于显示错误和其他通知
 */
export type ToastData = {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
};

// Toast上下文类型
interface ToastContextValue {
  // 添加通知
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  // 更新通知
  updateToast: (id: string, data: Partial<Omit<ToastData, 'id'>>) => void;
  // 移除通知
  removeToast: (id: string) => void;
  // 移除所有通知
  clearToasts: () => void;
}

// 创建上下文
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Toast提供者属性
interface ToastProviderProps {
  children: ReactNode;
  // 通知显示位置
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  // 默认通知显示时间
  defaultDuration?: number;
}

/**
 * Toast提供者组件
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right',
  defaultDuration = 5000
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  
  // 添加通知
  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration === undefined ? defaultDuration : toast.duration
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };
  
  // 更新通知
  const updateToast = (id: string, data: Partial<Omit<ToastData, 'id'>>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...data } : toast
    ));
  };
  
  // 移除通知
  const removeToast = (id: string) => {
    const toast = toasts.find(t => t.id === id);
    if (toast?.onClose) {
      toast.onClose();
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  // 移除所有通知
  const clearToasts = () => {
    // 调用所有通知的onClose回调
    toasts.forEach(toast => {
      if (toast.onClose) {
        toast.onClose();
      }
    });
    setToasts([]);
  };
  
  // 初始化portal容器
  useEffect(() => {
    // 检查是否已经存在toast容器
    let root = document.getElementById('toast-portal-root');
    if (!root) {
      // 如果不存在，创建一个
      root = document.createElement('div');
      root.id = 'toast-portal-root';
      document.body.appendChild(root);
    }
    setPortalRoot(root);
    
    // 组件卸载时清理
    return () => {
      // 不移除DOM元素，因为可能有其他ToastProvider实例仍在使用
    };
  }, []);
  
  // 管理通知自动关闭
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    toasts.forEach(toast => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
        timers.push(timer);
      }
    });
    
    // 清理定时器
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts]);
  
  // 确定位置样式
  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };
  
  // 渲染通知
  const renderToasts = () => {
    if (!portalRoot) return null;
    
    return createPortal(
      <div 
        className={`fixed z-50 max-w-md w-full flex flex-col gap-2 ${getPositionClass()}`}
        aria-live="assertive"
      >
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>,
      portalRoot
    );
  };
  
  return (
    <ToastContext.Provider 
      value={{ 
        addToast, 
        updateToast, 
        removeToast, 
        clearToasts 
      }}
    >
      {children}
      {renderToasts()}
    </ToastContext.Provider>
  );
};

// Toast单个项组件属性
interface ToastItemProps {
  toast: ToastData;
  onClose: () => void;
}

/**
 * Toast单个项组件
 */
const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  // 获取图标和样式
  const getToastStyles = (): { icon: React.ReactNode; bgColor: string; textColor: string } => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50 dark:bg-green-950 border-green-500',
          textColor: 'text-green-800 dark:text-green-300'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-50 dark:bg-red-950 border-red-500',
          textColor: 'text-red-800 dark:text-red-300'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-amber-50 dark:bg-amber-950 border-amber-500',
          textColor: 'text-amber-800 dark:text-amber-300'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-blue-50 dark:bg-blue-950 border-blue-500',
          textColor: 'text-blue-800 dark:text-blue-300'
        };
    }
  };
  
  const { icon, bgColor, textColor } = getToastStyles();
  
  return (
    <div 
      className={`w-full flex items-center p-4 rounded-lg shadow-lg border ${bgColor} ${textColor} transition-all`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="flex-1 mr-2">
        {toast.title && (
          <h3 className="font-medium text-sm">{toast.title}</h3>
        )}
        <p className="text-sm mt-1">{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="关闭"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * 使用Toast的自定义Hook
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export { Toast, ToastViewport } 