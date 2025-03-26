"use client";

import React from "react";

/**
 * 工具库页面
 *
 * 用于浏览和管理代理可用的工具
 */
export default function ToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-oid="zbmd4vj">
      <h1
        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-indigo-300"
        data-oid="1zn3v50"
      >
        工具库
      </h1>

      <div className="space-card p-6" data-oid="l7ee.ei">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid="1_eiq44"
        >
          添加工具
        </h2>
        <button className="space-button" data-oid="d0.d94p">
          添加新工具
        </button>
      </div>

      <div className="mt-10 space-card p-6" data-oid="d3up6q:">
        <h2
          className="text-xl font-semibold mb-3 text-indigo-300"
          data-oid=":58s4k6"
        >
          可用工具列表
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
          data-oid="wkuh9e-"
        >
          <div className="space-card p-4" data-oid="y-dng9z">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="iofagie"
            >
              网络搜索
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid="t255o39">
              允许代理搜索互联网获取信息
            </p>
          </div>
          <div className="space-card p-4" data-oid="._d.wp0">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="z5x7h-l"
            >
              代码执行
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid="0-987uk">
              允许代理执行和测试代码
            </p>
          </div>
          <div className="space-card p-4" data-oid="mm:64y3">
            <h3
              className="text-lg font-medium text-indigo-300"
              data-oid="q98.yi-"
            >
              文档分析
            </h3>
            <p className="text-sm text-slate-400 mt-1" data-oid=".v9:o9g">
              允许代理分析和处理文档内容
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
