// components/ui/Notification.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: NotificationProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // 300ms for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  if (!mounted) return null;

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-600/30 to-green-700/30 border-green-500/50";
      case "error":
        return "bg-gradient-to-r from-red-600/30 to-red-700/30 border-red-500/50";
      case "warning":
        return "bg-gradient-to-r from-yellow-600/30 to-yellow-700/30 border-yellow-500/50";
      case "info":
        return "bg-gradient-to-r from-blue-600/30 to-blue-700/30 border-blue-500/50";
      default:
        return "bg-gradient-to-r from-indigo-600/30 to-indigo-700/30 border-indigo-500/50";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-oid="g7-8emk"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
              data-oid="1er4l3s"
            />
          </svg>
        );

      case "error":
        return (
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-oid="e.uwbn1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
              data-oid="kkr94vi"
            />
          </svg>
        );

      case "warning":
        return (
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-oid="dyo:br3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              data-oid="ptvgo-z"
            />
          </svg>
        );

      case "info":
        return (
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            data-oid="r9:.55i"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              data-oid="lggevvu"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border shadow-lg mb-3 w-80 transform transition-all duration-300 backdrop-blur-sm",
        getBgColor(),
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
      data-oid="7u29k25"
    >
      <div className="flex" data-oid="1jv5lgp">
        <div className="flex-shrink-0" data-oid="hrf:zgi">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1" data-oid="bn6exbo">
          <p className="text-sm font-medium text-white" data-oid="ocb0lcc">
            {title}
          </p>
          <p className="mt-1 text-sm text-indigo-100/80" data-oid="z7lhf6q">
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex" data-oid="b27k89j">
          <button
            className="inline-flex text-indigo-300 hover:text-white focus:outline-none"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose(id), 300);
            }}
            data-oid="_8fpfo-"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              data-oid="0w38lzv"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="75o6xlx"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// 通知容器组件
export function NotificationContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 z-50 flex flex-col items-end"
      data-oid="d._3cml"
    >
      {children}
    </div>,
    document.body,
  );
}
