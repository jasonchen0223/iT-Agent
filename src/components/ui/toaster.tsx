"use client"

import {
  Toast,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

/**
 * Toaster组件
 * 
 * 用于显示应用中的所有Toast通知
 * 
 * @returns {React.ReactElement} Toaster组件
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastViewport>
      {toasts.map(function (toast) {
        return (
          <Toast
            key={toast.id}
            toast={toast}
          />
        )
      })}
    </ToastViewport>
  )
} 