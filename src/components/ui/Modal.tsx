// components/ui/Modal.tsx
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 当模态框打开时禁用背景滚动
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 处理点击背景关闭模态框
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理ESC键关闭模态框
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      data-oid="9_h_eu-"
    >
      <div
        className={cn(
          "bg-gradient-to-b from-indigo-950/90 to-black/90 border border-indigo-800/30 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in duration-300",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        data-oid="-rcxy1w"
      >
        {/* 头部 */}
        <div
          className="flex items-center justify-between p-4 border-b border-indigo-800/30"
          data-oid="81n0sz8"
        >
          <h3
            className="text-xl font-semibold text-indigo-100"
            data-oid="_8g43v:"
          >
            {title}
          </h3>
          <button
            className="text-indigo-300/70 hover:text-white"
            onClick={onClose}
            data-oid="8kc6i4i"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="byib7in"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="e2asxfb"
              />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]"
          data-oid="o5d-6u3"
        >
          {children}
        </div>

        {/* 底部 */}
        {footer ? (
          <div
            className="p-4 border-t border-indigo-800/30 bg-indigo-950/50"
            data-oid="rohx19v"
          >
            {footer}
          </div>
        ) : (
          <div
            className="p-4 border-t border-indigo-800/30 bg-indigo-950/50 flex justify-end space-x-3"
            data-oid="v.g4glk"
          >
            <Button variant="outline" onClick={onClose} data-oid="kr_9es:">
              取消
            </Button>
            <Button data-oid="orr6qza">确认</Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
