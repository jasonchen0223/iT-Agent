/**
 * 工具调用日志列表页面
 *
 * 显示工具调用的历史记录，支持过滤和查询
 */
import React from "react";
import ToolLogList from "@/components/tool-log/ToolLogList";
import ToolLogFilter from "@/components/tool-log/ToolLogFilter";

/**
 * 工具调用日志页面组件
 *
 * @returns 组件渲染结果
 */
export default function ToolLogsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-oid="lkxltdu">
      <h1
        className="text-3xl font-bold mb-8 text-center text-blue-400"
        data-oid="rmzww9d"
      >
        工具调用日志
      </h1>

      <div className="grid grid-cols-12 gap-6" data-oid="m6nprn3">
        {/* 左侧过滤面板 */}
        <div className="col-span-12 md:col-span-3" data-oid="qpcev50">
          <ToolLogFilter data-oid="h7.8ba_" />
        </div>

        {/* 右侧日志列表 */}
        <div className="col-span-12 md:col-span-9" data-oid="._ihv73">
          <ToolLogList data-oid="her5lim" />
        </div>
      </div>
    </div>
  );
}
