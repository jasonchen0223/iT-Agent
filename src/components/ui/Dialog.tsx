// components/ui/Dialog.tsx
"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, Fragment } from "react";
import { Button } from './button';
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // 处理关闭对话框
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onOpenChange(false);
    }, 150); // 与动画持续时间匹配
  };

  // 处理点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden"; // 禁用背景滚动
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto"; // 恢复背景滚动
    };
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!open && !isClosing) return null;

  return createPortal(
    <Fragment>
      {/* 背景遮罩 */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity",
          open && !isClosing ? "opacity-100" : "opacity-0",
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
        data-oid="fhp7vd7"
      />

      {/* 对话框内容 */}
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] transition-all duration-150",
          open && !isClosing ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
        data-oid="98qffz."
      >
        <div
          className="bg-gradient-to-b from-indigo-950/90 to-black/90 border border-indigo-800/30 rounded-lg shadow-xl overflow-hidden"
          data-oid="efj5tr5"
        >
          {/* 对话框标题 */}
          <div
            className="flex flex-col space-y-1.5 p-6 border-b border-indigo-800/30"
            data-oid="c4kbmtq"
          >
            <h2
              className="text-xl font-semibold text-indigo-100"
              data-oid="d7ybrod"
            >
              {title}
            </h2>
            {description && (
              <p className="text-sm text-indigo-300/70" data-oid="fm42tk9">
                {description}
              </p>
            )}
          </div>

          {/* 对话框内容 */}
          <div className="p-6" data-oid="0e.kpao">
            {children}
          </div>

          {/* 对话框底部 */}
          {footer ? (
            <div
              className="flex items-center justify-end space-x-3 p-6 border-t border-indigo-800/30 bg-indigo-950/50"
              data-oid="66noxgk"
            >
              {footer}
            </div>
          ) : (
            <div
              className="flex items-center justify-end space-x-3 p-6 border-t border-indigo-800/30 bg-indigo-950/50"
              data-oid=":zsx8-f"
            >
              <Button
                variant="outline"
                onClick={handleClose}
                data-oid="bkinuxp"
              >
                取消
              </Button>
              <Button onClick={handleClose} data-oid="jw5icf9">
                确认
              </Button>
            </div>
          )}
        </div>
      </div>
    </Fragment>,
    document.body,
  );
}

// 使用示例封装
export interface UseDialogOptions {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useDialog() {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<UseDialogOptions>({
    title: "",
  });

  const openDialog = (options: UseDialogOptions) => {
    setDialogProps(options);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  // 渲染对话框
  const renderDialog = () => (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title={dialogProps.title}
      description={dialogProps.description}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              dialogProps.onCancel?.();
              closeDialog();
            }}
            data-oid="v.b0jf-"
          >
            取消
          </Button>
          <Button
            onClick={() => {
              dialogProps.onConfirm?.();
              closeDialog();
            }}
            data-oid="n.5chr0"
          >
            确认
          </Button>
        </>
      }
      data-oid="zvpjkv8"
    />
  );

  return {
    openDialog,
    closeDialog,
    renderDialog,
  };
}
