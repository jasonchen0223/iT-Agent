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
    <div className="space-y-6" data-oid="9w2.nb_">
      {/* 工具基本信息 */}
      <div data-oid="u8ijb40">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="fldckbr"
        >
          工具信息
        </h2>
        <div
          className="bg-slate-800/50 rounded-md p-4 space-y-3"
          data-oid="8a4bf8j"
        >
          <div data-oid="ef9zagk">
            <span className="text-gray-400" data-oid="hkyypxg">
              ID:{" "}
            </span>
            <span className="text-white" data-oid="1ukaz:w">
              {tool.id}
            </span>
          </div>
          <div data-oid="leicaj5">
            <span className="text-gray-400" data-oid="sswz5cl">
              类别:{" "}
            </span>
            <Badge data-oid="qn1s0ih">{tool.category}</Badge>
          </div>
          {tool.tags && tool.tags.length > 0 && (
            <div data-oid="qssmyqn">
              <span className="text-gray-400" data-oid="5uq2f.h">
                标签:{" "}
              </span>
              <div className="flex flex-wrap gap-2 mt-1" data-oid="h:ifahw">
                {tool.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" data-oid="6amjnue">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div data-oid="843e81_">
            <span className="text-gray-400" data-oid="mgu4.6t">
              内置工具:{" "}
            </span>
            <span className="text-white" data-oid="gd7unul">
              {tool.isBuiltin ? "是" : "否"}
            </span>
          </div>
        </div>
      </div>

      {/* 工具描述 */}
      <div data-oid="qpc0-ln">
        <h2
          className="text-xl font-semibold text-white mb-2"
          data-oid="bgezt3z"
        >
          描述
        </h2>
        <div className="bg-slate-800/50 rounded-md p-4" data-oid="bh6_va.">
          <p className="text-gray-300" data-oid="jef_ipj">
            {tool.description}
          </p>
        </div>
      </div>

      {/* 工具参数 */}
      {tool.parameters && tool.parameters.length > 0 && (
        <div data-oid="2lypqoa">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="xvlh1a6"
          >
            参数
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="s_sjwwt">
            <div className="divide-y divide-gray-700" data-oid="jx7afjf">
              {tool.parameters.map((param: TToolParameter, index: number) => (
                <div
                  key={index}
                  className="py-3 first:pt-0 last:pb-0"
                  data-oid="9un5e_t"
                >
                  <div
                    className="flex justify-between items-start"
                    data-oid="g8cshff"
                  >
                    <div data-oid="d.gtd0j">
                      <span
                        className="font-medium text-indigo-400"
                        data-oid="d3_imod"
                      >
                        {param.name}
                      </span>
                      <span
                        className="ml-2 text-sm text-gray-400"
                        data-oid="-nr2tkj"
                      >
                        ({param.type})
                      </span>
                      {param.required && (
                        <Badge
                          variant="destructive"
                          className="ml-2"
                          data-oid="x8jgmkz"
                        >
                          必需
                        </Badge>
                      )}
                    </div>
                    {param.defaultValue !== undefined && (
                      <div className="text-sm text-gray-400" data-oid="o4xksgi">
                        默认值:{" "}
                        <code
                          className="bg-slate-700 px-1 py-0.5 rounded"
                          data-oid="f_w9_w6"
                        >
                          {String(param.defaultValue)}
                        </code>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-gray-300 text-sm" data-oid="o1mz9ev">
                    {param.description}
                  </p>

                  {param.options && param.options.length > 0 && (
                    <div className="mt-2" data-oid="-adz5cy">
                      <span
                        className="text-sm text-gray-400"
                        data-oid="u6b4e7_"
                      >
                        可选值:{" "}
                      </span>
                      <div
                        className="flex flex-wrap gap-1 mt-1"
                        data-oid="p6rbjlf"
                      >
                        {param.options.map((option, optIndex) => (
                          <code
                            key={optIndex}
                            className="text-xs bg-slate-700 px-1 py-0.5 rounded"
                            data-oid="wufk9v3"
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
        <div data-oid="0x3njb1">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="2q_e2gf"
          >
            返回值
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="bp2nxt8">
            <p className="text-gray-300" data-oid="-qx:gsu">
              {tool.returnType}
            </p>
          </div>
        </div>
      )}

      {/* 使用示例 */}
      {tool.examples && tool.examples.length > 0 && (
        <div data-oid="2vygue2">
          <h2
            className="text-xl font-semibold text-white mb-2"
            data-oid="5.xems6"
          >
            使用示例
          </h2>
          <div className="bg-slate-800/50 rounded-md p-4" data-oid="xg5em4o">
            <div className="space-y-4" data-oid="cauty1:">
              {tool.examples.map((example, index) => (
                <div
                  key={index}
                  className="bg-slate-900 p-3 rounded-md border border-gray-700"
                  data-oid="adyd4ud"
                >
                  <code
                    className="text-sm text-gray-300 font-mono whitespace-pre-wrap"
                    data-oid="eq1r.f."
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
