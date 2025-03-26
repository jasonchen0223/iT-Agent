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
          icon: <XCircle className="w-6 h-6 text-red-500" data-oid="p016gnr" />,
          containerStyle: "bg-red-50 dark:bg-red-950",
          borderStyle: "border-red-500",
          titleStyle: "text-red-700 dark:text-red-300",
        };
      case "high":
        return {
          icon: (
            <AlertCircle
              className="w-6 h-6 text-orange-500"
              data-oid="00igiur"
            />
          ),

          containerStyle: "bg-orange-50 dark:bg-orange-950",
          borderStyle: "border-orange-500",
          titleStyle: "text-orange-700 dark:text-orange-300",
        };
      case "medium":
        return {
          icon: (
            <AlertTriangle
              className="w-6 h-6 text-amber-500"
              data-oid="6kgk1m6"
            />
          ),

          containerStyle: "bg-amber-50 dark:bg-amber-950",
          borderStyle: "border-amber-500",
          titleStyle: "text-amber-700 dark:text-amber-300",
        };
      case "low":
        return {
          icon: <Info className="w-6 h-6 text-blue-500" data-oid="5o_jcue" />,
          containerStyle: "bg-blue-50 dark:bg-blue-950",
          borderStyle: "border-blue-500",
          titleStyle: "text-blue-700 dark:text-blue-300",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-6 h-6 text-indigo-500" data-oid="liwa4xz" />,
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
      data-oid="ff6dnnu"
    >
      <div className="flex items-start" data-oid="l83yksc">
        <div className="flex-shrink-0 mr-3" data-oid="wliisxi">
          {icon}
        </div>
        <div className="flex-1" data-oid="fn40v.n">
          <h3
            className={`text-sm font-medium ${titleStyle}`}
            data-oid="s6_ffmk"
          >
            {title}{" "}
            {code && (
              <span className="font-mono" data-oid="ui0ohzm">
                ({code})
              </span>
            )}
          </h3>
          <div
            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
            data-oid="ufqsu4d"
          >
            <p data-oid="6zgzfz3">{message}</p>

            {suggestion && (
              <div
                className="mt-2 text-sm text-gray-600 dark:text-gray-400"
                data-oid="okd3qcd"
              >
                <p data-oid="bjemivy">
                  <strong data-oid="3j2ana-">建议:</strong> {suggestion}
                </p>
              </div>
            )}

            {details && Object.keys(details).length > 0 && (
              <div className="mt-2" data-oid="7_1rpn6">
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  onClick={() => setShowDetails(!showDetails)}
                  data-oid="mjqgqqc"
                >
                  <span data-oid="teg9q:w">错误详情</span>
                  {showDetails ? (
                    <ChevronUp className="ml-1 w-4 h-4" data-oid="8y:pylg" />
                  ) : (
                    <ChevronDown className="ml-1 w-4 h-4" data-oid="4._-2qr" />
                  )}
                </button>
                {showDetails && (
                  <pre
                    className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-x-auto"
                    data-oid="z6nl-a7"
                  >
                    {formatDetails(details)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {onRetry && (
            <div className="mt-3" data-oid="5y1m8za">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                data-oid="6.q4vvf"
              >
                重试
              </button>
            </div>
          )}
        </div>

        {dismissible && (
          <div className="flex-shrink-0 ml-3" data-oid="zmo:sm7">
            <button
              type="button"
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onDismiss}
              data-oid="av:kxnj"
            >
              <span className="sr-only" data-oid="fi5-ix2">
                关闭
              </span>
              <X className="h-5 w-5" data-oid="ct-4w.p" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
