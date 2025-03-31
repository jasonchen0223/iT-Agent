"use client"

/**
 * 统一的Toast通知组件
 *
 * 整合已有的两个Toast实现，保持Shadcn UI的风格但增加中文注释
 * 用于显示错误、成功、警告和信息通知
 */
import * as React from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Toast类型
 */
export type ToastType = "success" | "error" | "warning" | "info" | "default"

/**
 * Toast位置
 */
export type ToastPosition = 
  | "top-left" 
  | "top-right" 
  | "top-center" 
  | "bottom-left" 
  | "bottom-right" 
  | "bottom-center"

/**
 * Toast属性
 */
export interface ToastProps {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  type?: ToastType
  duration?: number
  className?: string
  onDismiss?: (id: string) => void
}

/**
 * Toast上下文
 */
interface ToastContextProps {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, "id">) => string
  updateToast: (id: string, toast: Partial<ToastProps>) => void
  dismissToast: (id: string) => void
  dismissAllToasts: () => void
}

// 创建上下文
const ToastContext = React.createContext<ToastContextProps | undefined>(undefined)

/**
 * Toast上下文提供者属性
 */
interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  defaultDuration?: number
  maxToasts?: number
}

/**
 * Toast变体样式
 */
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
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
 * Toast提供者组件
 */
export function ToastProvider({
  children,
  position = "bottom-right",
  defaultDuration = 5000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])
  
  // 添加Toast
  const addToast = React.useCallback(
    (toast: Omit<ToastProps, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      
      setToasts((prevToasts) => {
        // 保留最新的maxToasts个通知
        const newToasts = [...prevToasts, { ...toast, id }]
        if (newToasts.length > maxToasts) {
          return newToasts.slice(-maxToasts)
        }
        return newToasts
      })
      
      return id
    },
    [maxToasts]
  )
  
  // 更新Toast
  const updateToast = React.useCallback(
    (id: string, toast: Partial<ToastProps>) => {
      setToasts((prevToasts) =>
        prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
      )
    },
    []
  )
  
  // 关闭Toast
  const dismissToast = React.useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])
  
  // 关闭所有Toast
  const dismissAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])
  
  // 上下文值
  const contextValue = React.useMemo(
    () => ({
      toasts,
      addToast,
      updateToast,
      dismissToast,
      dismissAllToasts,
    }),
    [toasts, addToast, updateToast, dismissToast, dismissAllToasts]
  )
  
  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport position={position} />
    </ToastContext.Provider>
  )
}

/**
 * 使用Toast钩子
 */
export function useToast() {
  const context = React.useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast必须在ToastProvider内使用")
  }
  
  return {
    toasts: context.toasts,
    toast: (props: Omit<ToastProps, "id">) => context.addToast(props),
    success: (props: Omit<ToastProps, "id" | "type">) => 
      context.addToast({ ...props, type: "success" }),
    error: (props: Omit<ToastProps, "id" | "type">) => 
      context.addToast({ ...props, type: "error" }),
    warning: (props: Omit<ToastProps, "id" | "type">) => 
      context.addToast({ ...props, type: "warning" }),
    info: (props: Omit<ToastProps, "id" | "type">) => 
      context.addToast({ ...props, type: "info" }),
    update: context.updateToast,
    dismiss: context.dismissToast,
    dismissAll: context.dismissAllToasts,
  }
}

/**
 * Toast视图属性
 */
interface ToastViewportProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ToastPosition
}

/**
 * Toast视图组件
 */
function ToastViewport({
  position = "bottom-right",
  className,
  ...props
}: ToastViewportProps) {
  const { toasts, dismissToast } = useToast()
  
  // 位置类名映射
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  }
  
  // 如果没有Toast则不渲染
  if (!toasts.length) return null
  
  return (
    <div
      className={cn(
        "fixed z-[100] flex max-h-screen flex-col-reverse p-4 gap-2 sm:max-w-[420px]",
        positionClasses[position],
        className
      )}
      {...props}
    >
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => dismissToast(toast.id)} 
        />
      ))}
    </div>
  )
}

/**
 * Toast组件属性
 */
interface ToastComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  toast: ToastProps
  onDismiss: () => void
}

/**
 * 获取Toast变体类型
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
 * 获取Toast图标
 */
function getToastIcon(type?: ToastType) {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5" />
    case "error":
      return <AlertCircle className="w-5 h-5" />
    case "warning":
      return <AlertTriangle className="w-5 h-5" />
    case "info":
      return <Info className="w-5 h-5" />
    default:
      return null
  }
}

/**
 * Toast组件
 */
function Toast({
  className,
  toast,
  onDismiss,
  ...props
}: ToastComponentProps) {
  // 自动关闭计时器
  React.useEffect(() => {
    if (toast.duration === Infinity || toast.duration === 0) {
      return
    }
    
    const timer = setTimeout(() => {
      onDismiss()
    }, toast.duration || 5000)
    
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])
  
  const variant = getToastVariant(toast.type)
  const icon = getToastIcon(toast.type)
  
  return (
    <div
      className={cn(toastVariants({ variant }), className)}
      data-toast-type={toast.type}
      {...props}
    >
      {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}
      <div className="flex-1 grid gap-1">
        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
        {toast.description && (
          <div className="text-sm opacity-90">{toast.description}</div>
        )}
      </div>
      {toast.action}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 rounded-md p-1 text-slate-300/50 opacity-70 transition-opacity hover:text-slate-300 hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">关闭</span>
      </button>
    </div>
  )
}

/**
 * Toaster组件 - 在根布局中使用的Toast容器
 */
export function Toaster() {
  const { toasts, dismissToast } = useToast()
  
  return (
    <div className="fixed z-[100] bottom-0 right-0 flex max-h-screen flex-col-reverse p-4 gap-2 sm:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onDismiss={() => dismissToast(toast.id)} 
        />
      ))}
    </div>
  )
} 