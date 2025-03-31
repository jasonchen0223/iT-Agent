/**
 * Toast通知组件
 *
 * 用于显示错误和其他通知
 */
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

// 通知类型
export type ToastType = "success" | "error" | "warning" | "info";

// 通知数据
export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

// Toast上下文类型
interface ToastContextValue {
  // 添加通知
  addToast: (toast: Omit<ToastData, "id">) => string;
  // 更新通知
  updateToast: (id: string, data: Partial<Omit<ToastData, "id">>) => void;
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
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  // 默认通知显示时间
  defaultDuration?: number;
}

/**
 * Toast提供者组件
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "top-right",
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  // 添加通知
  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
      duration: toast.duration === undefined ? defaultDuration : toast.duration,
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  // 更新通知
  const updateToast = (id: string, data: Partial<Omit<ToastData, "id">>) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, ...data } : toast)),
    );
  };

  // 移除通知
  const removeToast = (id: string) => {
    const toast = toasts.find((t) => t.id === id);
    if (toast?.onClose) {
      toast.onClose();
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // 移除所有通知
  const clearToasts = () => {
    // 调用所有通知的onClose回调
    toasts.forEach((toast) => {
      if (toast.onClose) {
        toast.onClose();
      }
    });
    setToasts([]);
  };

  // 初始化portal容器
  useEffect(() => {
    // 检查是否已经存在toast容器
    let root = document.getElementById("toast-portal-root");
    if (!root) {
      // 如果不存在，创建一个
      root = document.createElement("div");
      root.id = "toast-portal-root";
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

    toasts.forEach((toast) => {
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
        timers.push(timer);
      }
    });

    // 清理定时器
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  // 确定位置样式
  const getPositionClass = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
      default:
        return "top-4 right-4";
    }
  };

  // 渲染通知
  const renderToasts = () => {
    if (!portalRoot) return null;

    return createPortal(
      <div
        className={`fixed z-50 max-w-md w-full flex flex-col gap-2 ${getPositionClass()}`}
        aria-live="assertive"
        data-oid="73j0cvh"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
            data-oid="a8pdoig"
          />
        ))}
      </div>,
      portalRoot,
    );
  };

  return (
    <ToastContext.Provider
      value={{
        addToast,
        updateToast,
        removeToast,
        clearToasts,
      }}
      data-oid="o6jkug0"
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
  const getToastStyles = (): {
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
  } => {
    switch (toast.type) {
      case "success":
        return {
          icon: <CheckCircle className="w-5 h-5" data-oid="6v1palj" />,
          bgColor: "bg-green-50 dark:bg-green-950 border-green-500",
          textColor: "text-green-800 dark:text-green-300",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-5 h-5" data-oid="j91lg_l" />,
          bgColor: "bg-red-50 dark:bg-red-950 border-red-500",
          textColor: "text-red-800 dark:text-red-300",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5" data-oid=":b02pmf" />,
          bgColor: "bg-amber-50 dark:bg-amber-950 border-amber-500",
          textColor: "text-amber-800 dark:text-amber-300",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-5 h-5" data-oid="0ufayg1" />,
          bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-500",
          textColor: "text-blue-800 dark:text-blue-300",
        };
    }
  };

  const { icon, bgColor, textColor } = getToastStyles();

  return (
    <div
      className={`w-full flex items-center p-4 rounded-lg shadow-lg border ${bgColor} ${textColor} transition-all`}
      role="alert"
      data-oid="::po_z."
    >
      <div className="flex-shrink-0 mr-3" data-oid="xokkwn3">
        {icon}
      </div>
      <div className="flex-1 mr-2" data-oid="hvfyg48">
        {toast.title && (
          <h3 className="font-medium text-sm" data-oid="vr8xo.4">
            {toast.title}
          </h3>
        )}
        <p className="text-sm mt-1" data-oid="bvmx1ho">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-auto text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="关闭"
        data-oid=":2ts5zk"
      >
        <X className="w-4 h-4" data-oid="3:-4qtm" />
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
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
