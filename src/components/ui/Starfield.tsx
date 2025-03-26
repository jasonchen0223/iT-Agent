"use client";

import React, { useRef, useEffect } from "react";

interface StarfieldProps {
  starCount?: number;
  speed?: number;
  className?: string;
  maxSize?: number;
  backgroundColor?: string;
  shootingStars?: boolean;
  nebula?: boolean;
}

/**
 * 星空背景组件
 *
 * 一个生成动态星空背景的Canvas组件，支持设置星星数量、大小、速度和背景色
 */
export function Starfield({
  starCount = 200,
  speed = 0.2,
  maxSize = 2,
  backgroundColor = "rgba(15, 14, 45, 1)",
  className = "",
  shootingStars = true,
  nebula = true,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<
    { x: number; y: number; size: number; speed: number; brightness: number }[]
  >([]);
  const shootingStarRef = useRef<{
    x: number;
    y: number;
    length: number;
    speed: number;
    visible: boolean;
    opacity: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布大小为全屏
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 初始化星星
    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxSize,
          speed: (Math.random() * 0.3 + 0.1) * speed,
          brightness: Math.random() * 0.8 + 0.2,
        });
      }
    };

    initStars();

    // 初始化流星
    const initShootingStar = () => {
      if (!shootingStars) return;

      shootingStarRef.current = {
        x: Math.random() * canvas.width * 0.8,
        y: Math.random() * canvas.height * 0.3,
        length: 80 + Math.random() * 70,
        speed: 5 + Math.random() * 10,
        visible: false,
        opacity: 0,
      };
    };

    initShootingStar();

    // 创建星云效果
    const drawNebula = (ctx: CanvasRenderingContext2D) => {
      if (!nebula) return;

      // 创建第一个星云
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.3,
        canvas.height * 0.4,
        0,
        canvas.width * 0.3,
        canvas.height * 0.4,
        canvas.width * 0.4,
      );
      gradient1.addColorStop(0, "rgba(109, 77, 255, 0.1)");
      gradient1.addColorStop(0.3, "rgba(109, 77, 255, 0.03)");
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.fillStyle = gradient1;
      ctx.arc(
        canvas.width * 0.3,
        canvas.height * 0.4,
        canvas.width * 0.4,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // 创建第二个星云
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.7,
        canvas.height * 0.6,
        0,
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.3,
      );
      gradient2.addColorStop(0, "rgba(163, 72, 255, 0.1)");
      gradient2.addColorStop(0.3, "rgba(163, 72, 255, 0.03)");
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.fillStyle = gradient2;
      ctx.arc(
        canvas.width * 0.7,
        canvas.height * 0.6,
        canvas.width * 0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    };

    // 更新流星状态
    const updateShootingStar = () => {
      if (!shootingStars || !shootingStarRef.current) return;

      const shootingStar = shootingStarRef.current;

      // 如果流星不可见，随机决定是否显示
      if (!shootingStar.visible) {
        if (Math.random() < 0.005) {
          // 平均每200帧出现一次
          shootingStar.visible = true;
          shootingStar.opacity = 0;
          shootingStar.x = Math.random() * canvas.width * 0.8;
          shootingStar.y = Math.random() * canvas.height * 0.3;
        }
      } else {
        // 更新流星位置
        shootingStar.x += shootingStar.speed;
        shootingStar.y += shootingStar.speed * 0.6;

        // 更新不透明度
        if (shootingStar.x < canvas.width * 0.2) {
          shootingStar.opacity = Math.min(shootingStar.opacity + 0.05, 1);
        } else {
          shootingStar.opacity -= 0.01;
        }

        // 如果流星移出屏幕或不再可见，重置
        if (
          shootingStar.x > canvas.width ||
          shootingStar.y > canvas.height ||
          shootingStar.opacity <= 0
        ) {
          shootingStar.visible = false;
        }
      }
    };

    // 绘制流星
    const drawShootingStar = (ctx: CanvasRenderingContext2D) => {
      if (
        !shootingStars ||
        !shootingStarRef.current ||
        !shootingStarRef.current.visible
      )
        return;

      const shootingStar = shootingStarRef.current;

      ctx.save();

      // 创建流星的线性渐变
      const gradient = ctx.createLinearGradient(
        shootingStar.x,
        shootingStar.y,
        shootingStar.x - shootingStar.length,
        shootingStar.y - shootingStar.length * 0.6,
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      gradient.addColorStop(
        0.3,
        `rgba(180, 180, 255, ${shootingStar.opacity * 0.6})`,
      );
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x - shootingStar.length,
        shootingStar.y - shootingStar.length * 0.6,
      );
      ctx.stroke();

      // 添加流星头部的发光点
      ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
      ctx.beginPath();
      ctx.arc(shootingStar.x, shootingStar.y, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // 动画循环
    let animationId: number;
    const time = { value: 0 };

    const animate = () => {
      time.value += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制星云
      drawNebula(ctx);

      // 绘制星星
      starsRef.current.forEach((star) => {
        // 更新星星位置
        star.y += star.speed;

        // 如果星星移出屏幕底部，重新放置到顶部
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // 计算闪烁效果
        const twinkle = Math.sin(time.value + star.x * 0.01) * 0.2 + 0.8;

        // 绘制星星
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 更新和绘制流星
      updateShootingStar();
      drawShootingStar(ctx);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // 清理函数
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [starCount, speed, maxSize, backgroundColor, shootingStars, nebula]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ position: "absolute", left: 0, top: 0 }}
      data-oid="a82q8u-"
    />
  );
}
