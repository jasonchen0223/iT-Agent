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
    <div className="container mx-auto px-4 py-8" data-oid="73290bu">
      <h1
        className="text-3xl font-bold mb-8 text-center text-blue-400"
        data-oid="81.abzg"
      >
        工具调用日志
      </h1>

      <div className="grid grid-cols-12 gap-6" data-oid="zj1.y9p">
        {/* 左侧过滤面板 */}
        <div className="col-span-12 md:col-span-3" data-oid="gd:wn4j">
          <ToolLogFilter data-oid="foimgo1" />
        </div>

        {/* 右侧日志列表 */}
        <div className="col-span-12 md:col-span-9" data-oid="jel.07_">
          <ToolLogList data-oid="n1fxou0" />
        </div>
      </div>
    </div>
  );
}
