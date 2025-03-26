"use client";

import React from "react";

/**
 * 工具库页面
 *
 * 用于浏览和管理代理可用的工具
 */
export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-oid="q02x9eg">
      <h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300"
        data-oid="wil11ie"
      >
        工具库
      </h1>

      <div className="space-card p-6" data-oid=".4b52ie">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="bb0lkic"
        >
          添加工具
        </h2>
        <button className="space-button" data-oid="9k.4:4c">
          添加新工具
        </button>
      </div>

      <div className="mt-10 space-card p-6" data-oid="31be2op">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="11i48-n"
        >
          可用工具列表
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          data-oid="z6f9x7j"
        >
          <div className="space-card p-4" data-oid="ir0ayy4">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="tggccgq"
            >
              网络搜索
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid="9j_k1dv">
              允许代理搜索互联网获取信息
            </p>
          </div>
          <div className="space-card p-4" data-oid="e0h.ikp">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="mo6to7i"
            >
              代码执行
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid="xgsopl_">
              允许代理执行和测试代码
            </p>
          </div>
          <div className="space-card p-4" data-oid="7u4y7ie">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="u6o07j."
            >
              文档分析
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid="a8-5_ke">
              允许代理分析和处理文档内容
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
