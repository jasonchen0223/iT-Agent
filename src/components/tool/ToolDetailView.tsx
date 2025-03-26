"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TTool, TToolParameter } from "@/types/tool-types";

/**
 * 工具详情视图属性接口
 */
export interface IToolDetailViewProps {
  /**
   * 工具数据
   */
  tool: TTool;
}

/**
 * 工具详情视图组件
 *
 * 显示工具的详细信息，包括描述、参数、使用示例等
 *
 * @param {IToolDetailViewProps} props - 组件属性
 * @returns {React.ReactElement} 工具详情视图组件
 */
export const ToolDetailView: React.FC<IToolDetailViewProps> = ({ tool }) => {
  return (
    <div className="space-y-6">
      {/* 工具基本信息 */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">工具信息</h2>
        <div className="bg-slate-800/50 rounded-md p-4 space-y-3">
          <div>
            <span className="text-gray-400">ID: </span>
            <span className="text-white">{tool.id}</span>
          </div>
          <div>
            <span className="text-gray-400">类别: </span>
            <Badge>{tool.category}</Badge>
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div>
              <span className="text-gray-400">标签: </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {tool.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <span className="text-gray-400">内置工具: </span>
            <span className="text-white">{tool.isBuiltin ? "是" : "否"}</span>
          </div>
        </div>
      </div>

      {/* 工具描述 */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">描述</h2>
        <div className="bg-slate-800/50 rounded-md p-4">
          <p className="text-gray-300">{tool.description}</p>
        </div>
      </div>

      {/* 工具参数 */}
      {tool.parameters && tool.parameters.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">参数</h2>
          <div className="bg-slate-800/50 rounded-md p-4">
            <div className="divide-y divide-gray-700">
              {tool.parameters.map((param: TToolParameter, index: number) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-indigo-400">
                        {param.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-400">
                        ({param.type})
                      </span>
                      {param.required && (
                        <Badge variant="destructive" className="ml-2">
                          必需
                        </Badge>
                      )}
                    </div>
                    {param.defaultValue !== undefined && (
                      <div className="text-sm text-gray-400">
                        默认值:{" "}
                        <code className="bg-slate-700 px-1 py-0.5 rounded">
                          {String(param.defaultValue)}
                        </code>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-gray-300 text-sm">
                    {param.description}
                  </p>

                  {param.options && param.options.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-400">可选值: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {param.options.map((option, optIndex) => (
                          <code
                            key={optIndex}
                            className="text-xs bg-slate-700 px-1 py-0.5 rounded"
                          >
                            {String(option)}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 返回值类型 */}
      {tool.returnType && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">返回值</h2>
          <div className="bg-slate-800/50 rounded-md p-4">
            <p className="text-gray-300">{tool.returnType}</p>
          </div>
        </div>
      )}

      {/* 使用示例 */}
      {tool.examples && tool.examples.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">使用示例</h2>
          <div className="bg-slate-800/50 rounded-md p-4">
            <div className="space-y-4">
              {tool.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-900 p-3 rounded-md border border-gray-700"
                >
                  <code className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                    {example}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolDetailView;
