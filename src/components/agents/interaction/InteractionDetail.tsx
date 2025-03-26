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
          <div className="rounded-lg overflow-hidden" data-oid="9rer52n">
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
              data-oid="r.j--cd"
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
            <div
              className="bg-gray-800 rounded-lg p-4 overflow-auto"
              data-oid=".538_em"
            >
              <SyntaxHighlighter
                language="json"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                  backgroundColor: "transparent",
                }}
                data-oid="9_j69i3"
              >
                {JSON.stringify(toolData, null, 2)}
              </SyntaxHighlighter>
            </div>
          );
        } catch {
          // 如果解析失败，作为普通文本显示
          return (
            <div
              className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap overflow-auto"
              data-oid="m2bsvse"
            >
              {interaction.content}
            </div>
          );
        }

      case "error":
        return (
          <div
            className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 text-red-300 whitespace-pre-wrap overflow-auto"
            data-oid="2dx9cj6"
          >
            {interaction.content}
          </div>
        );

      default: // text 和其他类型
        return (
          <div
            className="bg-gray-800 rounded-lg p-4 whitespace-pre-wrap overflow-auto"
            data-oid="r01xiet"
          >
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
      <div
        className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full animate-pulse"
        data-oid="0d9sgol"
      >
        <div
          className="h-6 bg-gray-700 rounded w-1/4 mb-4"
          data-oid="0.m:zez"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-1/2 mb-2"
          data-oid="5:ds:m_"
        ></div>
        <div
          className="h-4 bg-gray-700 rounded w-3/4 mb-6"
          data-oid="-drnwpq"
        ></div>
        <div className="h-48 bg-gray-800 rounded mb-4" data-oid=":gpalxj"></div>
        <div
          className="h-4 bg-gray-700 rounded w-full mb-2"
          data-oid="_dub70l"
        ></div>
        <div className="h-4 bg-gray-700 rounded w-5/6" data-oid="k13f1:q"></div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div
        className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full"
        data-oid="uuelplg"
      >
        <div
          className="p-4 text-red-400 bg-red-900 bg-opacity-30 rounded-lg"
          data-oid="uanl3hl"
        >
          <p className="font-medium" data-oid="kn.nxu1">
            {error}
          </p>
          <button
            onClick={fetchInteractionDetail}
            className="mt-2 px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-white"
            data-oid="e88hwfh"
          >
            重试
          </button>
        </div>
        <div className="mt-4" data-oid="vfp4vyi">
          <Link
            href={`/agents/${agentId}/interactions`}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
            data-oid="3b11871"
          >
            <FiArrowLeft size={16} data-oid="0-:ete3" />
            <span data-oid="6lzwi1-">返回交互历史列表</span>
          </Link>
        </div>
      </div>
    );
  }

  // 如果数据仍未加载
  if (!interaction) {
    return (
      <div
        className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full"
        data-oid="sxr6py2"
      >
        <p className="text-center text-gray-400" data-oid="bn.n:-0">
          无法加载交互数据
        </p>
        <div className="mt-4" data-oid="nzf24ek">
          <Link
            href={`/agents/${agentId}/interactions`}
            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
            data-oid="y8q.9ds"
          >
            <FiArrowLeft size={16} data-oid="1dhl.zg" />
            <span data-oid="qcx2r3n">返回交互历史列表</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-lg shadow-xl p-6 w-full"
      data-oid="ngfj07x"
    >
      {/* 顶部导航 */}
      <div
        className="flex justify-between items-center mb-6"
        data-oid="py-1op3"
      >
        <Link
          href={`/agents/${agentId}/interactions`}
          className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300"
          data-oid="i-o8a74"
        >
          <FiArrowLeft size={16} data-oid="xf1ck38" />
          <span data-oid="t6-py_9">返回列表</span>
        </Link>

        <button
          onClick={downloadRawData}
          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          data-oid="oa8tfsf"
        >
          <FiDownload size={16} data-oid="759kgn9" />
          <span data-oid="l129n.h">下载原始数据</span>
        </button>
      </div>

      {/* 交互标题 */}
      <div className="mb-6" data-oid="0ixhtd3">
        <div className="flex items-center space-x-2 mb-1" data-oid="bi42ur9">
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
            data-oid="d_3kf0s"
          >
            {interaction.type}
          </span>
          <span className="text-gray-400 text-xs" data-oid="r3f3grw">
            ID: {interaction.id}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white" data-oid="xmhfyjh">
          交互详情
        </h1>
      </div>

      {/* 元数据面板 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        data-oid="thag3a:"
      >
        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="8okg9:h"
        >
          <h3
            className="flex items-center text-indigo-400 mb-3"
            data-oid="4uqz3r1"
          >
            <FiUser className="mr-2" data-oid="p2378o4" />
            <span data-oid=":y0fblw">参与代理</span>
          </h3>
          <div className="space-y-3" data-oid="tmwgprf">
            <div data-oid="d_cz08r">
              <div className="text-gray-400 text-sm" data-oid="6u-eh5f">
                发送方
              </div>
              <div className="flex items-center space-x-2" data-oid=":4.eut4">
                <span className="text-teal-400 font-medium" data-oid="rb8t66o">
                  {interaction.sender.name}
                </span>
                <span
                  className="text-xs bg-teal-900 bg-opacity-50 text-teal-300 px-2 py-1 rounded"
                  data-oid="z-w29ig"
                >
                  {interaction.sender.role}
                </span>
              </div>
            </div>
            <div data-oid="wp1rf:7">
              <div className="text-gray-400 text-sm" data-oid="je22n5i">
                接收方
              </div>
              <div className="flex items-center space-x-2" data-oid="ohc52f9">
                <span className="text-pink-400 font-medium" data-oid="kpa6l.:">
                  {interaction.receiver.name}
                </span>
                <span
                  className="text-xs bg-pink-900 bg-opacity-50 text-pink-300 px-2 py-1 rounded"
                  data-oid=":8zk7pi"
                >
                  {interaction.receiver.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
          data-oid="h4nfsl8"
        >
          <h3
            className="flex items-center text-indigo-400 mb-3"
            data-oid="8fi5x_3"
          >
            <FiClock className="mr-2" data-oid="20mspw7" />
            <span data-oid="t9rmthg">会话信息</span>
          </h3>
          <div className="space-y-3" data-oid="enq_.eh">
            <div data-oid="pj:1_:q">
              <div className="text-gray-400 text-sm" data-oid="dpezw9x">
                会话名称
              </div>
              <div className="text-blue-400 font-medium" data-oid="073fi1s">
                {interaction.session.name}
              </div>
            </div>
            <div data-oid="azdtvmv">
              <div className="text-gray-400 text-sm" data-oid="l:2mwnr">
                时间戳
              </div>
              <div className="text-white" data-oid="sa-zdfu">
                {formatTime(interaction.timestamp)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="mb-6" data-oid="0ldguk8">
        <h3
          className="flex items-center text-indigo-400 mb-3"
          data-oid="yd:2wtl"
        >
          <FiMessageCircle className="mr-2" data-oid=":h.9p47" />
          <span data-oid="k3:wqce">消息内容</span>
        </h3>
        {renderContent()}
      </div>

      {/* 元数据区域 */}
      {interaction.metadata && (
        <div data-oid="gqpjp7j">
          <h3
            className="flex items-center text-indigo-400 mb-3"
            data-oid=".e20dnf"
          >
            <FiTag className="mr-2" data-oid="h104jc9" />
            <span data-oid="u2271s4">元数据</span>
          </h3>
          <div
            className="bg-gray-800 bg-opacity-50 p-4 rounded-lg"
            data-oid="762z-3s"
          >
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                backgroundColor: "transparent",
              }}
              data-oid="pvj.kne"
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
