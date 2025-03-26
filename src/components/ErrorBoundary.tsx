/**
 * 错误边界组件
 *
 * 用于捕获和处理React组件渲染过程中的错误
 */
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorDisplay } from "./ui/ErrorDisplay";

interface ErrorBoundaryProps {
  /**
   * 子组件
   */
  children: ReactNode;

  /**
   * 自定义回退UI
   */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);

  /**
   * 错误处理回调
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * 是否显示重试按钮
   */
  showRetry?: boolean;
}

interface ErrorBoundaryState {
  /**
   * 是否发生错误
   */
  hasError: boolean;

  /**
   * 错误对象
   */
  error: Error | null;
}

/**
 * 错误边界组件
 *
 * 捕获子组件树中的JavaScript错误，记录这些错误，并显示回退UI
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * 更新状态，使下一次渲染显示回退UI
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * 记录错误信息
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 记录错误到控制台
    console.error("组件渲染错误:", error, errorInfo);

    // 调用自定义错误处理回调
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * 重置错误状态
   */
  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, showRetry = true } = this.props;

    // 如果没有错误，渲染子组件
    if (!hasError) {
      return children;
    }

    // 如果有错误，渲染回退UI
    if (fallback) {
      // 如果回退UI是函数，调用它
      if (typeof fallback === "function") {
        return fallback(error!, this.resetError);
      }
      // 否则渲染提供的回退UI
      return fallback;
    }

    // 默认回退UI
    return (
      <div className="p-4">
        <ErrorDisplay
          title="组件渲染错误"
          message={error?.message || "渲染过程中发生未知错误"}
          severity="high"
          suggestion="请尝试刷新页面，或联系管理员"
          details={error ? { name: error.name, stack: error.stack } : undefined}
          onRetry={showRetry ? this.resetError : undefined}
        />
      </div>
    );
  }
}
