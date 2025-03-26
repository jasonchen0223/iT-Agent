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
    <div className="space-y-6" data-oid="cxx0.g2">
      {/* 工具基本信息 */}
      <div data-oid=":q_xgsg">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="h2twwqu"
        >
          工具信息
        </h2>
        <div
          className="bg-slate-800/50 rounded-md p-4 space-y-3"
          data-oid=":3apj-:"
        >
          <div data-oid=".k54nq5">
            <span className="text-gray-400" data-oid="zvmrz1t">
              ID:{" "}
            </span>
            <span className="text-white" data-oid="h-03r_p">
              {tool.id}
            </span>
          </div>
          <div data-oid="9.xv3y_">
            <span className="text-gray-400" data-oid="s8w7yds">
              类别:{" "}
            </span>
            <Badge data-oid="uocgjeb">{tool.category}</Badge>
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div data-oid="dh1sa2j">
              <span className="text-gray-400" data-oid="ss4qsoe">
                标签:{" "}
              </span>
              <div className="flex flex-wrap gap-2 mt-1" data-oid="6d0ejez">
                {tool.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" data-oid=":7jurq7">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div data-oid="adv:pp6">
            <span className="text-gray-400" data-oid="p5vg4nd">
              内置工具:{" "}
            </span>
            <span className="text-white" data-oid="u:mp-59">
              {tool.isBuiltin ? "是" : "否"}
            </span>
          </div>
        </div>
      </div>

      {/* 工具描述 */}
      <div data-oid="78uc3np">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="dmi-bs4"
        >
          描述
        </h2>
        <div className="bg-slate-800/50 rounded-md p-4" data-oid="jqnzaha">
          <p className="text-gray-300" data-oid="y5rgqst">
            {tool.description}
          </p>
        </div>
      </div>

      {/* 工具参数 */}
      {tool.parameters && tool.parameters.length > 0 && (
        <div data-oid="km.7jko">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="ao9sz9n"
          >
            参数
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="cg-0_ld">
            <div className="divide-y divide-gray-700" data-oid="9yr-cn9">
              {tool.parameters.map((param: TToolParameter, index: number) => (
                <div
                  key={index}
                  className="py-3 first:pt-0 last:pb-0"
                  data-oid="qpd3k25"
                >
                  <div
                    className="flex justify-between items-start"
                    data-oid=".f:kmwc"
                  >
                    <div data-oid="_-tfdm_">
                      <span
                        className="font-medium text-indigo-400"
                        data-oid="-zndq21"
                      >
                        {param.name}
                      </span>
                      <span
                        className="ml-2 text-sm text-gray-400"
                        data-oid="smg4.ls"
                      >
                        ({param.type})
                      </span>
                      {param.required && (
                        <Badge
                          variant="destructive"
                          className="ml-2"
                          data-oid="e3e.24c"
                        >
                          必需
                        </Badge>
                      )}
                    </div>
                    {param.defaultValue !== undefined && (
                      <div className="text-sm text-gray-400" data-oid="ldqgvgo">
                        默认值:{" "}
                        <code
                          className="bg-slate-700 px-1 py-0.5 rounded"
                          data-oid=".nzamgj"
                        >
                          {String(param.defaultValue)}
                        </code>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-gray-300 text-sm" data-oid="04x4dra">
                    {param.description}
                  </p>

                  {param.options && param.options.length > 0 && (
                    <div className="mt-2" data-oid="92e8-_d">
                      <span
                        className="text-sm text-gray-400"
                        data-oid="q7xfnpq"
                      >
                        可选值:{" "}
                      </span>
                      <div
                        className="flex flex-wrap gap-1 mt-1"
                        data-oid="5dtl9yd"
                      >
                        {param.options.map((option, optIndex) => (
                          <code
                            key={optIndex}
                            className="text-xs bg-slate-700 px-1 py-0.5 rounded"
                            data-oid="3mty6zg"
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
        <div data-oid="vpqvqmj">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="acnov3_"
          >
            返回值
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="qxyq0qy">
            <p className="text-gray-300" data-oid="7pqfq3u">
              {tool.returnType}
            </p>
          </div>
        </div>
      )}

      {/* 使用示例 */}
      {tool.examples && tool.examples.length > 0 && (
        <div data-oid="0tkz:kh">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="f1mjwr4"
          >
            使用示例
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="scfl5di">
            <div className="space-y-4" data-oid="u4ytvta">
              {tool.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-900 p-3 rounded-md border border-gray-700"
                  data-oid="37kjy0k"
                >
                  <code
                    className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
                    data-oid="-u_nkgj"
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
