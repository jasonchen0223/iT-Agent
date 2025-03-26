"use client";

import React from "react";

/**
 * 设置页面
 *
 * 用于配置系统行为、外观和集成选项
 */
export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-oid="o7qsbfl">
      <h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300"
        data-oid="g9a7xc2"
      >
        设置
      </h1>

      <div className="space-card p-6" data-oid="aw6vb30">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="9emn07."
        >
          系统配置
        </h2>
        <div className="space-between flex flex-col gap-4" data-oid="flbrid5">
          <div className="flex items-center justify-between" data-oid="z.8po78">
            <label className="text-white" data-oid="z2qt2zh">
              深色模式
            </label>
            <div
              className="w-12 h-6 bg-indigo-900/40 rounded-full relative"
              data-oid="y3x7w_b"
            >
              <div
                className="absolute left-1 top-1 w-4 h-4 bg-indigo-400 rounded-full"
                data-oid="7zl.-ic"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between" data-oid="454w95n">
            <label className="text-white" data-oid="cnmxnae">
              自动保存会话
            </label>
            <div
              className="w-12 h-6 bg-indigo-900/40 rounded-full relative"
              data-oid="1bbio-e"
            >
              <div
                className="absolute left-7 top-1 w-4 h-4 bg-indigo-400 rounded-full"
                data-oid="akup4iq"
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between" data-oid="6-:6i3e">
            <label className="text-white" data-oid="85wu1l7">
              API密钥管理
            </label>
            <button className="space-button text-sm py-1" data-oid="g-ueg4.">
              管理密钥
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-card p-6" data-oid="vb22pg4">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="lca3gzp"
        >
          关于系统
        </h2>
        <div className="text-slate-300" data-oid="w84bh78">
          <p className="mb-2" data-oid="e2h2k5g">
            版本: 0.1.0
          </p>
          <p className="mb-2" data-oid="7o1n0lo">
            基于: Next.js + AutoGen
          </p>
          <p data-oid="9jr5k6a">主题: 宇宙星空</p>
        </div>
      </div>
    </div>
  );
}
