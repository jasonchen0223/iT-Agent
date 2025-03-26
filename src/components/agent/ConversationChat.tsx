import React, { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";

/**
 * 消息类型
 */
type MessageRole = "user" | "assistant" | "tool" | "executor" | "system";

/**
 * 消息接口
 */
export interface IMessage {
  /**
   * 消息ID
   */
  id: string;
  /**
   * 发送者ID
   */
  senderId: string;
  /**
   * 发送者名称
   */
  senderName: string;
  /**
   * 发送者角色
   */
  senderRole: MessageRole;
  /**
   * 内容
   */
  content: string;
  /**
   * 发送时间
   */
  timestamp: Date | string;
  /**
   * 是否正在生成
   */
  isGenerating?: boolean;
}

/**
 * 对话聊天属性接口
 */
export interface IConversationChatProps {
  /**
   * 会话ID
   */
  sessionId: string;
  /**
   * 消息列表
   */
  messages: IMessage[];
  /**
   * 是否加载中
   */
  isLoading?: boolean;
  /**
   * 是否正在生成消息
   */
  isGenerating?: boolean;
  /**
   * 发送消息事件
   */
  onSendMessage: (message: string) => void;
  /**
   * 停止生成事件
   */
  onStopGeneration?: () => void;
}

/**
 * 对话聊天组件
 *
 * 显示对话消息并提供消息输入功能
 *
 * @param {IConversationChatProps} props - 对话聊天属性
 * @returns {React.ReactElement} 对话聊天组件
 */
const ConversationChat: React.FC<IConversationChatProps> = ({
  sessionId,
  messages,
  isLoading = false,
  isGenerating = false,
  onSendMessage,
  onStopGeneration,
}) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 角色颜色映射
  const roleColors: Record<MessageRole, string> = {
    user: "bg-indigo-600 text-indigo-50",
    assistant: "bg-emerald-600 text-emerald-50",
    tool: "bg-amber-600 text-amber-50",
    executor: "bg-cyan-600 text-cyan-50",
    system: "bg-gray-600 text-gray-50",
  };

  // 提交消息
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const messageText = inputMessage.trim();
    if (messageText && !isGenerating) {
      onSendMessage(messageText);
      setInputMessage("");
    }
  };

  // 渲染单个消息
  const renderMessage = (message: IMessage) => {
    const isUserMessage = message.senderRole === "user";
    const color = roleColors[message.senderRole] || roleColors.system;

    return (
      <div
        key={message.id}
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"} mb-4`}
        data-oid="c6jhgth"
      >
        <div
          className={`max-w-[80%] ${isUserMessage ? "order-2" : "order-1"}`}
          data-oid="_od95y3"
        >
          <div className="flex items-center mb-1" data-oid="-2-2a29">
            {!isUserMessage && (
              <span
                className={`text-xs px-2 py-1 rounded-full mr-2 ${color}`}
                data-oid="51m-mq_"
              >
                {message.senderName}
              </span>
            )}
            <span className="text-xs text-gray-400" data-oid="rn0:a4f">
              {typeof message.timestamp === "string"
                ? message.timestamp
                : message.timestamp.toLocaleTimeString("zh-CN")}
            </span>
          </div>

          <div
            className={`p-3 rounded-lg ${
              isUserMessage
                ? "bg-indigo-900/60 text-white rounded-tr-none"
                : "bg-gray-800/80 text-white rounded-tl-none"
            }`}
            data-oid="sbgehhm"
          >
            {message.content}
            {message.isGenerating && (
              <span
                className="inline-block ml-1 w-2 h-4 bg-indigo-500 animate-pulse"
                data-oid="j57e96r"
              ></span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full" data-oid="p.x2kkq">
      {/* 消息列表 */}
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto px-4 py-6 bg-gray-900/50 rounded-lg"
        data-oid="2:coi65"
      >
        {isLoading ? (
          <div
            className="flex items-center justify-center h-full"
            data-oid="-qq6l_x"
          >
            <div
              className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"
              data-oid="d5_db2q"
            ></div>
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            data-oid="d7anq3:"
          >
            <div className="text-center" data-oid="sx:6v59">
              <p className="text-gray-400 mb-3" data-oid="javr:sf">
                没有消息
              </p>
              <p className="text-sm text-gray-500" data-oid="m7ha9w0">
                发送消息开始对话
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4" data-oid="kgnlyi1">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} data-oid="u9bw8mz" />
          </div>
        )}
      </div>

      {/* 消息输入区域 */}
      <div className="mt-4" data-oid="j54boot">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
          data-oid="t83mx7v"
        >
          <div className="flex-grow" data-oid="k-v9_j1">
            <label
              htmlFor="message-input"
              className="block text-sm text-gray-400 mb-1"
              data-oid="0a:6dvo"
            >
              发送消息
            </label>
            <textarea
              id="message-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="输入消息..."
              rows={3}
              disabled={isGenerating}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              data-oid="d-hkaat"
            />

            <p className="text-xs text-gray-500 mt-1" data-oid="6m-ilj9">
              按 Enter 发送, Shift + Enter 换行
            </p>
          </div>

          <div className="flex gap-2" data-oid="lu:jq__">
            {isGenerating && onStopGeneration && (
              <Button
                type="button"
                variant="secondary"
                onClick={onStopGeneration}
                data-oid="3q.0v9z"
              >
                停止生成
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || isGenerating}
              data-oid="0mw._i:"
            >
              发送
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConversationChat;
