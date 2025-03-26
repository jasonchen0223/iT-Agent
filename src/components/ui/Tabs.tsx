// components/ui/Tabs.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  // 找到所有子元素中与当前活动标签匹配的元素
  const findActiveChild = () => {
    const childrenArray = React.Children.toArray(children);

    // 查找ID匹配的子元素
    const matchById = childrenArray.find(
      (child) => React.isValidElement(child) && child.props.id === activeTab,
    );

    if (matchById) return matchById;

    // 如果没有找到匹配的元素，则返回第一个子元素
    return childrenArray[0];
  };

  return (
    <div className={className}>
      <div className="border-b border-indigo-800/30 mb-6">
        <div className="flex space-x-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              className={cn(
                "py-3 px-1 border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-100"
                  : "border-transparent text-indigo-300/70 hover:text-indigo-100 hover:border-indigo-800/50",
                tab.disabled && "opacity-50 cursor-not-allowed",
              )}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content">{findActiveChild()}</div>
    </div>
  );
}
