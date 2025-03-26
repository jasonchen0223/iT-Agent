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
      data-oid="h3lvn2c"
    >
      <div
        className={cn(
          "bg-gradient-to-b from-indigo-950/90 to-black/90 border border-indigo-800/30 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in duration-300",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        data-oid="39il5ri"
      >
        {/* 头部 */}
        <div
          className="flex items-center justify-between p-4 border-b border-indigo-800/30"
          data-oid="afy_wi9"
        >
          <h3
            className="text-xl font-semibold text-indigo-100"
            data-oid="bqqb48v"
          >
            {title}
          </h3>
          <button
            className="text-indigo-300/70 hover:text-white"
            onClick={onClose}
            data-oid="lcfm40x"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="_137edd"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
                data-oid="y5s0b_p"
              />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div
          className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]"
          data-oid="921jghs"
        >
          {children}
        </div>

        {/* 底部 */}
        {footer ? (
          <div
            className="p-4 border-t border-indigo-800/30 bg-indigo-950/50"
            data-oid="bwn234g"
          >
            {footer}
          </div>
        ) : (
          <div
            className="p-4 border-t border-indigo-800/30 bg-indigo-950/50 flex justify-end space-x-3"
            data-oid="6-r3lp4"
          >
            <Button variant="outline" onClick={onClose} data-oid="fjq6s2b">
              取消
            </Button>
            <Button data-oid="y6316a6">确认</Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
