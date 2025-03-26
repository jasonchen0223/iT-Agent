// components/ui/StarBackground.tsx
"use client";

import { useEffect } from "react";

export default function StarBackground() {
  useEffect(() => {
    // 创建星星
    const createStars = () => {
      const container = document.getElementById("star-container");
      if (!container) return;

      // 清除现有星星
      container.innerHTML = "";

      // 创建新星星
      const starCount = window.innerWidth < 768 ? 50 : 100;

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        container.appendChild(star);
      }
    };

    // 初始创建
    createStars();

    // 窗口大小变化时重新创建
    window.addEventListener("resize", createStars);

    return () => {
      window.removeEventListener("resize", createStars);
    };
  }, []);

  return (
    <>
      <div
        id="star-container"
        className="fixed inset-0 pointer-events-none z-0"
        data-oid="f:yt90z"
      ></div>
      <div
        className="stardust fixed inset-0 pointer-events-none z-0"
        data-oid="syvu9_e"
      ></div>
    </>
  );
}
