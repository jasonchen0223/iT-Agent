"use client";

import React from "react";

/**
 * 会话管理页面
 *
 * 用于创建和管理多代理协作会话
 */
export default function SessionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300">
        会话管理
      </h1>

      <div className="space-card p-6">
        <h2 className="text-xl font-semibold mb-3 text-indigo-300">
          创建新会话
        </h2>
        <button className="space-button">创建会话</button>
      </div>

      <div className="mt-10 space-card p-6">
        <h2 className="text-xl font-semibold mb-3 text-indigo-300">会话列表</h2>
        <p className="text-center py-8 text-slate-400">暂无会话记录</p>
      </div>
    </div>
  );
}
