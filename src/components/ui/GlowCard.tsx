"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  glowSize?: "sm" | "md" | "lg";
  glowIntensity?: number;
  children: React.ReactNode;
  pulsating?: boolean;
  className?: string;
}

/**
 * 发光卡片组件
 *
 * 一个带有鼠标悬停发光效果的卡片组件，可以设置发光颜色、大小和强度
 */
export function GlowCard({
  glowColor = "rgba(109, 77, 255, 0.7)",
  glowSize = "md",
  glowIntensity = 1,
  children,
  pulsating = false,
  className,
  ...props
}: GlowCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 计算发光效果尺寸
  const glowSizeValue = {
    sm: "150px",
    md: "200px",
    lg: "300px",
  }[glowSize];

  // 计算发光强度
  const intensityValue = Math.min(Math.max(glowIntensity, 0.2), 2);

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 动画变体
  const variants = {
    default: {
      opacity: 0,
    },
    hover: {
      opacity: intensityValue * 0.7,
    },
    pulsating: {
      opacity: [
        intensityValue * 0.4,
        intensityValue * 0.7,
        intensityValue * 0.4,
      ],

      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={cn("space-card relative overflow-hidden", className)}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* 发光效果 */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: glowSizeValue,
          height: glowSizeValue,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(255,255,255,0) 70%)`,
          transform: `translate(-50%, -50%)`,
          left: position.x,
          top: position.y,
          zIndex: 0,
        }}
        initial="default"
        animate={pulsating ? "pulsating" : isHovered ? "hover" : "default"}
        variants={variants}
        transition={{ duration: 0.2 }}
      />

      {/* 静态发光边框效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          boxShadow: `0 0 ${glowSize === "sm" ? "8" : glowSize === "lg" ? "25" : "15"}px ${glowColor}`,
          opacity: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: pulsating ? [0.2, 0.4, 0.2] : isHovered ? 0.4 : 0 }}
        transition={
          pulsating
            ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {
                duration: 0.3,
              }
        }
      />

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
