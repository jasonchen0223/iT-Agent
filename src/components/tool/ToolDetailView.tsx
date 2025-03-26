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
    <div className="space-y-6" data-oid="6xik30y">
      {/* 工具基本信息 */}
      <div data-oid="7e.9gcb">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="wu6gh.d"
        >
          工具信息
        </h2>
        <div
          className="bg-slate-800/50 rounded-md p-4 space-y-3"
          data-oid="kdpa-g7"
        >
          <div data-oid="n0e-9.r">
            <span className="text-gray-400" data-oid="xk:87tm">
              ID:{" "}
            </span>
            <span className="text-white" data-oid="6c.a_2:">
              {tool.id}
            </span>
          </div>
          <div data-oid="9het-gy">
            <span className="text-gray-400" data-oid="5:tyttc">
              类别:{" "}
            </span>
            <Badge data-oid="zhxucdb">{tool.category}</Badge>
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div data-oid="5c-rbs_">
              <span className="text-gray-400" data-oid="vv7nwk0">
                标签:{" "}
              </span>
              <div className="flex flex-wrap gap-2 mt-1" data-oid=".wvmf8r">
                {tool.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" data-oid="8.6xjz6">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div data-oid="s2shqqn">
            <span className="text-gray-400" data-oid="gvynh4c">
              内置工具:{" "}
            </span>
            <span className="text-white" data-oid="fo7fs6r">
              {tool.isBuiltin ? "是" : "否"}
            </span>
          </div>
        </div>
      </div>

      {/* 工具描述 */}
      <div data-oid=".1a82:y">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="hsiycoo"
        >
          描述
        </h2>
        <div className="bg-slate-800/50 rounded-md p-4" data-oid="92d6m0b">
          <p className="text-gray-300" data-oid="32z44w7">
            {tool.description}
          </p>
        </div>
      </div>

      {/* 工具参数 */}
      {tool.parameters && tool.parameters.length > 0 && (
        <div data-oid="kz5dq:6">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="7-69.-d"
          >
            参数
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="ii.hkz0">
            <div className="divide-y divide-gray-700" data-oid=":55f5pj">
              {tool.parameters.map((param: TToolParameter, index: number) => (
                <div
                  key={index}
                  className="py-3 first:pt-0 last:pb-0"
                  data-oid="b4aea9q"
                >
                  <div
                    className="flex justify-between items-start"
                    data-oid="2e2fz5t"
                  >
                    <div data-oid="_ecw6z5">
                      <span
                        className="font-medium text-indigo-400"
                        data-oid="8b0p48b"
                      >
                        {param.name}
                      </span>
                      <span
                        className="ml-2 text-sm text-gray-400"
                        data-oid="06dqwb7"
                      >
                        ({param.type})
                      </span>
                      {param.required && (
                        <Badge
                          variant="destructive"
                          className="ml-2"
                          data-oid="tft4zp8"
                        >
                          必需
                        </Badge>
                      )}
                    </div>
                    {param.defaultValue !== undefined && (
                      <div className="text-sm text-gray-400" data-oid=".llm_1u">
                        默认值:{" "}
                        <code
                          className="bg-slate-700 px-1 py-0.5 rounded"
                          data-oid="4f4ib6z"
                        >
                          {String(param.defaultValue)}
                        </code>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-gray-300 text-sm" data-oid="co707sr">
                    {param.description}
                  </p>

                  {param.options && param.options.length > 0 && (
                    <div className="mt-2" data-oid="_-e_uj:">
                      <span
                        className="text-sm text-gray-400"
                        data-oid="llfr6h_"
                      >
                        可选值:{" "}
                      </span>
                      <div
                        className="flex flex-wrap gap-1 mt-1"
                        data-oid="tgizec2"
                      >
                        {param.options.map((option, optIndex) => (
                          <code
                            key={optIndex}
                            className="text-xs bg-slate-700 px-1 py-0.5 rounded"
                            data-oid="5zo19ka"
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
        <div data-oid="3yr6_1g">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid=":qm2-ap"
          >
            返回值
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="pcz9o1f">
            <p className="text-gray-300" data-oid="vxoqmf.">
              {tool.returnType}
            </p>
          </div>
        </div>
      )}

      {/* 使用示例 */}
      {tool.examples && tool.examples.length > 0 && (
        <div data-oid="3t3t_92">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="e_4bar6"
          >
            使用示例
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="u.zri27">
            <div className="space-y-4" data-oid="7j237zs">
              {tool.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-900 p-3 rounded-md border border-gray-700"
                  data-oid="1.21_98"
                >
                  <code
                    className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
                    data-oid="u78cn1d"
                  >
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
