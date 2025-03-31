"use client";

// components/ui/Card.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  withBorder?: boolean;
}

export function Card({
  children,
  className,
  hoverable = false,
  withBorder = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-indigo-950/40 to-black/40 backdrop-blur-sm rounded-lg p-6",
        withBorder && "border border-indigo-800/30",
        hoverable && "hover:border-indigo-500 transition-colors",
        className,
      )}
      data-oid="5kbv9ih"
    >
      {children}
    </div>
  );
}

// 卡片标题
export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn("text-xl font-semibold text-indigo-100 mb-4", className)}
      data-oid="ag5ns6g"
    >
      {children}
    </h3>
  );
}

// 卡片内容
export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("text-indigo-300/70", className)} data-oid="us42us_">
      {children}
    </div>
  );
}

// 卡片底部
export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-indigo-800/30", className)}
      data-oid=".6.b9vn"
    >
      {children}
    </div>
  );
}

// 卡片头部
export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mb-4", className)}
      data-oid="cd.hd01"
    >
      {children}
    </div>
  );
}

// 卡片描述
export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("text-sm text-indigo-300/70", className)}
      data-oid="cd.ds01"
    >
      {children}
    </p>
  );
}
