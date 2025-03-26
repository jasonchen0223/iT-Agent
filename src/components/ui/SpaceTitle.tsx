"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpaceTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "left" | "center" | "right";
  glowing?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

/**
 * 星空主题标题组件
 *
 * 一个带有星空主题效果的标题组件，可以设置标题大小、对齐方式、是否发光和动画效果
 */
export function SpaceTitle({
  children,
  className,
  as = "h2",
  align = "left",
  glowing = true,
  size = "md",
  animated = true,
}: SpaceTitleProps) {
  // 根据尺寸计算字体大小
  const fontSize = {
    sm: "text-lg md:text-xl",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl",
    xl: "text-3xl md:text-4xl",
  }[size];

  // 根据对齐方式设置样式
  const alignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  // 发光效果
  const glowEffect = glowing
    ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500"
    : "";

  // 动画效果
  const animationProps = animated
    ? {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
      }
    : {};

  // 渲染不同级别的标题
  const Component = motion[as];

  return (
    <Component
      className={cn(
        fontSize,
        alignment,
        glowEffect,
        "font-bold tracking-tight",
        "relative",
        className,
      )}
      {...animationProps}
      data-oid="x0vs6ia"
    >
      {children}

      {/* 添加底部装饰线条 */}
      {glowing && (
        <motion.div
          className={cn(
            "h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent",
            "absolute bottom-[-6px] left-0 right-0",
            align === "center"
              ? "w-3/4 mx-auto"
              : align === "right"
                ? "w-1/2 ml-auto"
                : "w-1/2",
          )}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.7 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut",
          }}
          data-oid="7f1618l"
        />
      )}

      {/* 添加星星点缀效果 */}
      {glowing && (
        <>
          <motion.div
            className="absolute w-[3px] h-[3px] rounded-full bg-indigo-300"
            style={{
              bottom: "-3px",
              left: align === "center" ? "calc(25% - 1px)" : "15%",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            data-oid="3g9iit4"
          />

          <motion.div
            className="absolute w-[2px] h-[2px] rounded-full bg-violet-300"
            style={{
              bottom: "0px",
              right:
                align === "center"
                  ? "calc(25% - 1px)"
                  : align === "right"
                    ? "15%"
                    : "65%",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            data-oid="qx3frzf"
          />
        </>
      )}
    </Component>
  );
}
