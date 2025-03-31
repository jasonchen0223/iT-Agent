import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * 表格容器组件
 * 
 * 提供基础表格结构，应用靛青主题样式
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm",
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

/**
 * 表格头部组件
 * 
 * 提供表格头部结构
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-indigo-950/40 border-b border-indigo-800/30", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * 表格主体组件
 * 
 * 提供表格主体结构
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * 表格页脚组件
 * 
 * 提供表格页脚结构
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-indigo-950/60 font-medium", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * 表格行组件
 * 
 * 提供表格行结构和状态样式
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-indigo-800/30 transition-colors hover:bg-indigo-900/20 data-[state=selected]:bg-indigo-800/30",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * 表格头单元格组件
 * 
 * 提供表格头部单元格结构
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-indigo-100 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * 表格单元格组件
 * 
 * 提供表格数据单元格结构
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * 表格标题组件
 * 
 * 提供表格标题结构
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-indigo-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} 