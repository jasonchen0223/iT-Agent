/**
 * 工具类别筛选组件
 *
 * 用于按类别筛选工具
 */
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TToolCategory } from "@/types/tool-types";
import { cn } from "@/utils/ui-utils";

/**
 * 类别选项接口
 */
interface ICategoryOption {
  /**
   * 类别值
   */
  value: TToolCategory | "";
  /**
   * 类别标签
   */
  label: string;
  /**
   * 类别图标
   */
  icon: React.ReactNode;
}

/**
 * 工具类别筛选组件
 *
 * 提供工具类别过滤功能，允许用户根据类别筛选工具
 *
 * @returns {React.ReactElement} 工具类别筛选组件
 */
export const ToolCategoryFilter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  // 类别选项
  const categoryOptions: ICategoryOption[] = [
    {
      value: "",
      label: "全部",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="amxo6mo"
        >
          <rect x="3" y="3" width="7" height="7" data-oid="yny.42."></rect>
          <rect x="14" y="3" width="7" height="7" data-oid="r-c4rcb"></rect>
          <rect x="14" y="14" width="7" height="7" data-oid="_3-:yo1"></rect>
          <rect x="3" y="14" width="7" height="7" data-oid="lzdyzvw"></rect>
        </svg>
      ),
    },
    {
      value: TToolCategory.AI,
      label: "AI",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="kxn74ja"
        >
          <path
            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
            data-oid="4s6jcg7"
          ></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" data-oid="9aj0a6l"></path>
          <line x1="12" y1="19" x2="12" y2="22" data-oid="o-ll4.1"></line>
        </svg>
      ),
    },
    {
      value: TToolCategory.DEVELOPMENT,
      label: "开发",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="x:k7t5:"
        >
          <polyline points="16 18 22 12 16 6" data-oid=".3lv47g"></polyline>
          <polyline points="8 6 2 12 8 18" data-oid="71mj3w9"></polyline>
        </svg>
      ),
    },
    {
      value: TToolCategory.PRODUCTIVITY,
      label: "效率",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="65x513:"
        >
          <path d="M12 20h9" data-oid="cjp3vx7"></path>
          <path
            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
            data-oid="l:ydmd3"
          ></path>
        </svg>
      ),
    },
    {
      value: TToolCategory.COMMUNICATION,
      label: "通信",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="fs3hdrp"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
            data-oid="x:bx65l"
          ></path>
        </svg>
      ),
    },
    {
      value: TToolCategory.ANALYSIS,
      label: "分析",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="x1ojspl"
        >
          <path
            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            data-oid="tn-a:zl"
          ></path>
          <polyline
            points="3.27 6.96 12 12.01 20.73 6.96"
            data-oid="f44btee"
          ></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12" data-oid="xrnrxtl"></line>
        </svg>
      ),
    },
    {
      value: TToolCategory.SYSTEM,
      label: "系统",
      icon: (
        <svg
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-oid="9fbl1t4"
        >
          <circle cx="12" cy="12" r="3" data-oid="kjh5il0"></circle>
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            data-oid="l11drnc"
          ></path>
        </svg>
      ),
    },
  ];

  // 处理类别变更
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/tools?${params.toString()}`);
  };

  return (
    <div
      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700"
      data-oid="dgujlw3"
    >
      <h3 className="text-lg font-medium text-white mb-4" data-oid="0vl20xb">
        工具分类
      </h3>
      <div className="space-y-2" data-oid="mtmznbo">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            className={cn(
              "flex items-center w-full p-2 rounded-md transition-colors text-left",
              currentCategory === option.value
                ? "bg-indigo-900/50 text-indigo-300"
                : "text-gray-300 hover:bg-slate-700/50 hover:text-white",
            )}
            onClick={() => handleCategoryChange(option.value)}
            data-oid="9nt2zp-"
          >
            <span className="mr-3 flex-shrink-0" data-oid="c3.hzcy">
              {option.icon}
            </span>
            <span data-oid=":418ryw">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolCategoryFilter;
