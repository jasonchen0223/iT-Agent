/**
 * 错误显示组件
 *
 * 用于在UI中显示错误信息
 */
import React, { useState } from "react";
import {
  AlertCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// 错误严重程度类型
export type ErrorSeverity = "critical" | "high" | "medium" | "low" | "info";

// 错误显示组件属性
interface ErrorDisplayProps {
  // 错误标题
  title: string;
  // 错误消息
  message: string;
  // 严重程度
  severity?: ErrorSeverity;
  // 错误代码
  code?: string;
  // 错误建议
  suggestion?: string;
  // 错误详情
  details?: Record<string, any>;
  // 可关闭
  dismissible?: boolean;
  // 关闭回调
  onDismiss?: () => void;
  // 重试回调
  onRetry?: () => void;
  // 宽度样式
  className?: string;
}

/**
 * 错误显示组件
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  severity = "medium",
  code,
  suggestion,
  details,
  dismissible = true,
  onDismiss,
  onRetry,
  className,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // 根据严重程度设置样式
  const getSeverityStyles = (): {
    icon: React.ReactNode;
    containerStyle: string;
    borderStyle: string;
    titleStyle: string;
  } => {
    switch (severity) {
      case "critical":
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          containerStyle: "bg-red-50 dark:bg-red-950",
          borderStyle: "border-red-500",
          titleStyle: "text-red-700 dark:text-red-300",
        };
      case "high":
        return {
          icon: <AlertCircle className="w-6 h-6 text-orange-500" />,

          containerStyle: "bg-orange-50 dark:bg-orange-950",
          borderStyle: "border-orange-500",
          titleStyle: "text-orange-700 dark:text-orange-300",
        };
      case "medium":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,

          containerStyle: "bg-amber-50 dark:bg-amber-950",
          borderStyle: "border-amber-500",
          titleStyle: "text-amber-700 dark:text-amber-300",
        };
      case "low":
        return {
          icon: <Info className="w-6 h-6 text-blue-500" />,
          containerStyle: "bg-blue-50 dark:bg-blue-950",
          borderStyle: "border-blue-500",
          titleStyle: "text-blue-700 dark:text-blue-300",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-6 h-6 text-indigo-500" />,
          containerStyle: "bg-indigo-50 dark:bg-indigo-950",
          borderStyle: "border-indigo-500",
          titleStyle: "text-indigo-700 dark:text-indigo-300",
        };
    }
  };

  const { icon, containerStyle, borderStyle, titleStyle } = getSeverityStyles();

  // 格式化错误详情显示
  const formatDetails = (details: Record<string, any>): string => {
    try {
      return JSON.stringify(details, null, 2);
    } catch (error) {
      return `无法格式化错误详情: ${error instanceof Error ? error.message : "未知错误"}`;
    }
  };

  return (
    <div
      className={`relative rounded-lg border ${borderStyle} p-4 ${containerStyle} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{icon}</div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${titleStyle}`}>
            {title} {code && <span className="font-mono">({code})</span>}
          </h3>
          <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            <p>{message}</p>

            {suggestion && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>建议:</strong> {suggestion}
                </p>
              </div>
            )}

            {details && Object.keys(details).length > 0 && (
              <div className="mt-2">
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <span>错误详情</span>
                  {showDetails ? (
                    <ChevronUp className="ml-1 w-4 h-4" />
                  ) : (
                    <ChevronDown className="ml-1 w-4 h-4" />
                  )}
                </button>
                {showDetails && (
                  <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-x-auto">
                    {formatDetails(details)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                重试
              </button>
            </div>
          )}
        </div>

        {dismissible && (
          <div className="flex-shrink-0 ml-3">
            <button
              type="button"
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onDismiss}
            >
              <span className="sr-only">关闭</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
