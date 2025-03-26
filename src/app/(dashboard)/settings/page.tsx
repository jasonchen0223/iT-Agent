"use client";

import React from "react";

/**
 * 设置页面
 *
 * 用于配置系统行为、外观和集成选项
 */
export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-oid="2i003aa">
      <h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300"
        data-oid="9nr_ch_"
      >
        设置
      </h1>

      <div className="space-card p-6" data-oid="7gumaat">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="szl2ram"
        >
          系统配置
        </h2>
        <div className="space-between flex flex-col gap-4" data-oid="-e1w10v">
          <div className="flex items-center justify-between" data-oid="yt6h7u5">
            <label className="text-white" data-oid="-d-.mrv">
              深色模式
            </label>
            <div
              className="w-12 h-6 bg-indigo-900/40 rounded-full relative"
              data-oid="yyhn8ee"
            >
              <div
                className="absolute left-1 top-1 w-4 h-4 bg-indigo-400 rounded-full"
                data-oid="ov-e83d"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between" data-oid="t0mvfum">
            <label className="text-white" data-oid="dafq.a7">
              自动保存会话
            </label>
            <div
              className="w-12 h-6 bg-indigo-900/40 rounded-full relative"
              data-oid="5g87td3"
            >
              <div
                className="absolute left-7 top-1 w-4 h-4 bg-indigo-400 rounded-full"
                data-oid="ydq020a"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between" data-oid="rn7k4v4">
            <label className="text-white" data-oid="ixdr3mk">
              API密钥管理
            </label>
            <button className="space-button text-sm py-1" data-oid="h1_jddu">
              管理密钥
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-card p-6" data-oid="2ynl:8c">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="s:5omp-"
        >
          关于系统
        </h2>
        <div className="text-slate-300" data-oid="qbdsj:h">
          <p className="mb-2" data-oid="mvyrilb">
            版本: 0.1.0
          </p>
          <p className="mb-2" data-oid="73ruuwk">
            基于: Next.js + AutoGen
          </p>
          <p data-oid="kk0luk7">主题: 宇宙星空</p>
        </div>
      </div>
    </div>
  );
}
