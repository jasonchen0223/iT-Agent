"use client";

import React from "react";

/**
 * 设置页面
 *
 * 用于配置系统行为、外观和集成选项
 */
export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300">
        设置
      </h1>

      <div className="space-card p-6">
        <h2 className="text-xl font-semibold mb-3 text-indigo-300">系统配置</h2>
        <div className="space-between flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-white">深色模式</label>
            <div className="w-12 h-6 bg-indigo-900/40 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-indigo-400 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white">自动保存会话</label>
            <div className="w-12 h-6 bg-indigo-900/40 rounded-full relative">
              <div className="absolute left-7 top-1 w-4 h-4 bg-indigo-400 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-white">API密钥管理</label>
            <button className="space-button text-sm py-1">管理密钥</button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-card p-6">
        <h2 className="text-xl font-semibold mb-3 text-indigo-300">关于系统</h2>
        <div className="text-slate-300">
          <p className="mb-2">版本: 0.1.0</p>
          <p className="mb-2">基于: Next.js + AutoGen</p>
          <p>主题: 宇宙星空</p>
        </div>
      </div>
    </div>
  );
}
