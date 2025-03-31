// components/ui/tabs.tsx
"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

// 原始的自定义Tabs组件
interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface BasicTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: React.ReactNode;
  className?: string;
}

export function BasicTabs({ tabs, defaultTab, children, className }: BasicTabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

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
    <div className={className} data-oid="zptqoqv">
      <div className="border-b border-indigo-800/30 mb-6" data-oid="s:rdibt">
        <div
          className="flex space-x-6 overflow-x-auto no-scrollbar"
          data-oid="wt8qws3"
        >
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
              data-oid="pxz1-y:"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-content" data-oid="67v8-8s">
        {findActiveChild()}
      </div>
    </div>
  );
}

// Radix UI Tabs组件
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-indigo-950/40 p-1 text-indigo-300",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-indigo-900/60 data-[state=active]:text-indigo-100 data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
