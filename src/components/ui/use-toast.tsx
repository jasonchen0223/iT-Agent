// 基于 https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/use-toast.ts 修改
// 提供toast通知功能

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

import { useToast } from "@/hooks/use-toast"

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
 * Toast类型
 */
export type ToastType = "default" | "success" | "info" | "warning" | "error"

/**
 * Toast属性
 */
export type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  type?: ToastType
  duration?: number
  position?: ToastPosition
  className?: string
  onDismiss?: (id: string) => void
}

/**
 * Toast状态
 */
export type ToastState = {
  toasts: ToastProps[]
}

/**
 * Toast操作类型
 */
export type ToastActionType =
  | {
      type: "ADD_TOAST"
      toast: ToastProps
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToastProps> & { id: string }
    }
  | {
      type: "DISMISS_TOAST"
      toastId: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId: string
    }

/**
 * 创建Toast上下文
 */
const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
}

let count = 0

/**
 * 生成Toast ID
 * 
 * @returns {string} 生成的Toast ID
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

/**
 * Toast reducer
 * 
 * @param {ToastState} state - 当前Toast状态
 * @param {ToastActionType} action - Toast操作
 * @returns {ToastState} 新的Toast状态
 */
const toastReducer = (state: ToastState, action: ToastActionType): ToastState => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, onDismiss: undefined } : t
        ),
      }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

/**
 * Toast上下文
 */
export const ToastContext = React.createContext<{
  state: ToastState
  dispatch: React.Dispatch<ToastActionType>
}>({
  state: { toasts: [] },
  dispatch: () => null,
})

/**
 * Toast提供者属性
 */
export interface ToastProviderProps {
  children: React.ReactNode
}

/**
 * Toast提供者组件
 * 
 * @param {ToastProviderProps} props - Toast提供者属性
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  })

  return (
    <ToastContext.Provider value={{ state, dispatch }}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * 使用Toast上下文
 * 
 * @returns {object} Toast上下文
 */
export const useToast = () => {
  const { state, dispatch } = React.useContext(ToastContext)

  /**
   * 创建Toast
   * 
   * @param {Omit<ToastProps, "id">} props - Toast属性
   * @returns {object} Toast操作方法
   */
  function toast(props: Omit<ToastProps, "id">) {
    const id = genId()

    const update = (props: Partial<ToastProps>) =>
      dispatch({
        type: actionTypes.UPDATE_TOAST,
        toast: { ...props, id },
      })

    const dismiss = () =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

    dispatch({
      type: actionTypes.ADD_TOAST,
      toast: {
        ...props,
        id,
        onDismiss: dismiss,
      },
    })

    return {
      id,
      dismiss,
      update,
    }
  }

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toastId as string }),
  }
}

/**
 * 使用Toast定时器
 * 
 * @param {ToastProps} toast - Toast属性
 * @param {(id: string) => void} dispatch - 分发函数
 */
export function useToastTimer(
  toast: ToastProps,
  dispatch: React.Dispatch<ToastActionType>
) {
  React.useEffect(() => {
    if (toast.duration === Infinity) {
      return
    }

    const timer = setTimeout(() => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId: toast.id })
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, dispatch])
}

export const Toaster = () => {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && (
              <div className="flex items-center justify-end">
                <Slot className="flex-shrink-0">{action}</Slot>
              </div>
            )}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
} 