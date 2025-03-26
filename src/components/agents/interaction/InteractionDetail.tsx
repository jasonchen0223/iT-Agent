"use client";

import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiMessageCircle,
  FiTag,
  FiCode,
  FiDownload,
} from "react-icons/fi";
import Link from "next/link";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface InteractionDetailProps {
  agentId: string;
  interactionId: string;
  initialData?: any;
}

/**
 * 代理交互历史详情组件
 */
const InteractionDetail: React.FC<InteractionDetailProps> = ({
  agentId,
  interactionId,
  initialData,
}) => {
  const [interaction, setInteraction] = useState<any>(initialData);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [error, setError] = useState<string | null>(null);

  // 加载交互详情
  useEffect(() => {
    if (!initialData) {
      fetchInteractionDetail();
    }
  }, [agentId, interactionId]);

  // 获取交互详情数据
  const fetchInteractionDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/agents/${agentId}/interactions/${interactionId}`,
      );

      if (!response.ok) {
        throw new Error("获取交互详情失败");
      }

      const data = await response.json();
      setInteraction(data.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间显示
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // 下载原始数据
  const downloadRawData = () => {
    if (!interaction) return;

    const dataStr = JSON.stringify(interaction, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `interaction-${interactionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 渲染内容部分，根据消息类型使用不同的展示方式
  const renderContent = () => {
    if (!interaction) return null;

    switch (interaction.type) {
      case "code":
        // 尝试从内容中检测语言，或默认为javascript
        const lang = detectLanguage(interaction.content);
        return (
          <div className="rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language={lang}
              style={vscDarkPlus}
              showLineNumbers
              wrapLines
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                backgroundColor: "#1e1e2e",
              }}
            >
              {interaction.content}
            </SyntaxHighlighter>
          </div>
        );

      case "tool_call":
      case "tool_result":
        // 尝试解析工具调用或结果的JSON
        try {
          let toolData;
          if (typeof interaction.content === "string") {
            toolData = JSON.parse(interaction.content);
          } else {
            toolData = interaction.content;
          }

          return (
            <div className="bg-gray-800 rounded-lg p-4 overflow-auto">
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  backgroundColor: "transparent",
                }}
              >
                {JSON.stringify(toolData, null, 2)}
              </SyntaxHighlighter>
            </div>
          );
        } catch {
          // 如果解析失败，作为普通文本显示
          return (
            <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap overflow-auto">
              {interaction.content}
            </div>
          );
        }

      case "error":
        return (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 text-red-300 whitespace-pre-wrap overflow-auto">
            {interaction.content}
          </div>
        );

      default: // text 和其他类型
        return (
          <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap overflow-auto">
            {interaction.content}
          </div>
        );
    }
  };

  // 从代码内容中尝试检测语言
  const detectLanguage = (content: string): string => {
    if (!content) return "javascript";

    // 检测常见语言特征
    if (
      content.includes("import React") ||
      content.includes('from "react"') ||
      content.includes("from 'react'")
    ) {
      return "jsx";
    } else if (
      content.includes("import ") &&
      (content.includes('from "') || content.includes("from '"))
    ) {
      if (
        content.includes(":") &&
        (content.includes("interface ") || content.includes("type "))
      ) {
        return "typescript";
      }
      return "javascript";
    } else if (content.includes("func ") && content.includes("package ")) {
      return "go";
    } else if (content.includes("def ") && content.includes(":")) {
      return "python";
    } else if (
      content.includes("#include") &&
      (content.includes("<iostream>") || content.includes("<stdio.h>"))
    ) {
      return "cpp";
    } else if (
      content.includes("public class ") ||
      content.includes("private class ")
    ) {
      return "java";
    } else if (
      content.startsWith("<!DOCTYPE html>") ||
      content.includes("<html>")
    ) {
      return "html";
    } else if (
      content.includes(".class") ||
      content.includes("#id") ||
      content.includes("@media")
    ) {
      return "css";
    } else if (content.includes("SELECT ") && content.includes(" FROM ")) {
      return "sql";
    }

    // 默认为javascript
    return "javascript";
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="h-48 bg-gray-800 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full">
        <div className="p-4 text-red-400 bg-red-900 bg-opacity-30 rounded-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchInteractionDetail}
            className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white"
          >
            重试
          </button>
        </div>
        <div className="mt-4">
          <Link
            href={`/agents/${agentId}/interactions`}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
          >
            <FiArrowLeft size={16} />
            <span>返回交互历史列表</span>
          </Link>
        </div>
      </div>
    );
  }

  // 如果数据仍未加载
  if (!interaction) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full">
        <p className="text-center text-gray-400">无法加载交互数据</p>
        <div className="mt-4">
          <Link
            href={`/agents/${agentId}/interactions`}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
          >
            <FiArrowLeft size={16} />
            <span>返回交互历史列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full">
      {/* 顶部导航 */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href={`/agents/${agentId}/interactions`}
          className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
        >
          <FiArrowLeft size={16} />
          <span>返回列表</span>
        </Link>

        <button
          onClick={downloadRawData}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <FiDownload size={16} />
          <span>下载原始数据</span>
        </button>
      </div>

      {/* 交互标题 */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`text-xs px-2 py-1 rounded ${
              {
                text: "bg-blue-500 text-white",
                code: "bg-green-500 text-white",
                tool_call: "bg-purple-500 text-white",
                tool_result: "bg-yellow-500 text-white",
                error: "bg-red-500 text-white",
              }[interaction.type] || "bg-gray-500 text-white"
            }`}
          >
            {interaction.type}
          </span>
          <span className="text-gray-400 text-xs">ID: {interaction.id}</span>
        </div>
        <h1 className="text-2xl font-bold text-white">交互详情</h1>
      </div>

      {/* 元数据面板 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h3 className="flex items-center text-indigo-400 mb-3">
            <FiUser className="mr-2" />
            <span>参与代理</span>
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-gray-400 text-sm">发送方</div>
              <div className="flex items-center space-x-2">
                <span className="text-teal-400 font-medium">
                  {interaction.sender.name}
                </span>
                <span className="text-xs bg-teal-900 bg-opacity-50 text-teal-300 px-2 py-1 rounded">
                  {interaction.sender.role}
                </span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">接收方</div>
              <div className="flex items-center space-x-2">
                <span className="text-pink-400 font-medium">
                  {interaction.receiver.name}
                </span>
                <span className="text-xs bg-pink-900 bg-opacity-50 text-pink-300 px-2 py-1 rounded">
                  {interaction.receiver.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
          <h3 className="flex items-center text-indigo-400 mb-3">
            <FiClock className="mr-2" />
            <span>会话信息</span>
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-gray-400 text-sm">会话名称</div>
              <div className="text-blue-400 font-medium">
                {interaction.session.name}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">时间戳</div>
              <div className="text-white">
                {formatTime(interaction.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="mb-6">
        <h3 className="flex items-center text-indigo-400 mb-3">
          <FiMessageCircle className="mr-2" />
          <span>消息内容</span>
        </h3>
        {renderContent()}
      </div>

      {/* 元数据区域 */}
      {interaction.metadata && (
        <div>
          <h3 className="flex items-center text-indigo-400 mb-3">
            <FiTag className="mr-2" />
            <span>元数据</span>
          </h3>
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                backgroundColor: "transparent",
              }}
            >
              {JSON.stringify(interaction.metadata, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionDetail;
