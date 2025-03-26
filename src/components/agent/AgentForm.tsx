import React, { useState, useEffect } from "react";
import { TAgentRole } from "@/types/agent";
import Button from "../ui/Button";
import Card from "../ui/Card";

/**
 * 代理表单数据接口
 */
export interface IAgentFormData {
  /**
   * 代理ID
   */
  id?: string;
  /**
   * 代理名称
   */
  name: string;
  /**
   * 代理角色
   */
  role: TAgentRole;
  /**
   * 代理描述
   */
  description: string;
  /**
   * 系统消息
   */
  systemMessage: string;
  /**
   * 代理颜色
   */
  color?: string;
  /**
   * LLM配置
   */
  llmConfig?: {
    /**
     * 模型名称
     */
    model: string;
    /**
     * 温度参数
     */
    temperature: number;
    /**
     * 最大生成长度
     */
    maxTokens?: number;
  };
  /**
   * 可用工具ID列表
   */
  tools?: string[];
}

/**
 * 代理表单属性接口
 */
export interface IAgentFormProps {
  /**
   * 初始代理数据
   */
  initialData?: Partial<IAgentFormData>;
  /**
   * 提交处理函数
   */
  onSubmit: (data: IAgentFormData) => void;
  /**
   * 取消处理函数
   */
  onCancel?: () => void;
  /**
   * 是否处于提交中状态
   */
  isSubmitting?: boolean;
  /**
   * 可用工具列表
   */
  availableTools?: Array<{ id: string; name: string; description: string }>;
}

/**
 * 代理配置表单组件
 *
 * 用于创建或编辑代理配置
 *
 * @param {IAgentFormProps} props - 代理表单属性
 * @returns {React.ReactElement} 代理表单组件
 */
const AgentForm: React.FC<IAgentFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  availableTools = [],
}) => {
  // 默认LLM配置
  const defaultLlmConfig = {
    model: "gpt-4",
    temperature: 0.2,
    maxTokens: 2000,
  };

  // 表单数据
  const [formData, setFormData] = useState<IAgentFormData>({
    name: "",
    role: TAgentRole.ASSISTANT,
    description: "",
    systemMessage: "",
    color: "#6366f1", // 默认靛青色
    llmConfig: defaultLlmConfig,
    tools: [],
    ...initialData,
  });

  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 选中的工具
  const [selectedTools, setSelectedTools] = useState<Set<string>>(
    new Set(initialData.tools || []),
  );

  // 表单输入改变处理
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除错误
    setError(null);
  };

  // LLM配置改变处理
  const handleLlmConfigChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      llmConfig: {
        ...prev.llmConfig!,
        [name]:
          name === "temperature" || name === "maxTokens"
            ? parseFloat(value)
            : value,
      },
    }));
  };

  // 工具选择处理
  const handleToolToggle = (toolId: string) => {
    setSelectedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }

      // 更新表单数据中的工具列表
      setFormData((prevData) => ({
        ...prevData,
        tools: Array.from(newSet),
      }));

      return newSet;
    });
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 基本验证
    if (!formData.name.trim()) {
      setError("代理名称不能为空");
      return;
    }

    if (!formData.systemMessage.trim()) {
      setError("系统消息不能为空");
      return;
    }

    // 提交数据
    onSubmit({
      ...formData,
      tools: Array.from(selectedTools),
    });
  };

  // 根据角色获取默认系统消息模板
  const getRoleSystemMessageTemplate = (role: TAgentRole): string => {
    const templates: Record<TAgentRole, string> = {
      [TAgentRole.USER]:
        "你是用户代理，负责接收用户指令并与其他代理协作。你的主要目标是确保用户的需求被正确理解和执行。",
      [TAgentRole.ASSISTANT]:
        "你是助手代理，负责提供全面的支持和建议。你的目标是基于你的知识和技能，为用户提供最佳帮助。",
      [TAgentRole.ORCHESTRATOR]:
        "你是协调者代理，负责组织和管理其他代理的工作。你的目标是确保任务高效地分配和执行。",
      [TAgentRole.EXECUTOR]:
        "你是执行者代理，负责执行具体的行动和操作。你的目标是准确而高效地完成分配给你的任务。",
      [TAgentRole.PLANNER]:
        "你是规划者代理，负责制定策略和计划。你的目标是为复杂问题创建结构化的解决方案。",
      [TAgentRole.CRITIC]:
        "你是批评者代理，负责审查和评估其他代理的工作。你的目标是提供建设性的反馈以改进结果。",
      [TAgentRole.RESEARCHER]:
        "你是研究者代理，负责收集和分析信息。你的目标是找到解决问题所需的相关数据和知识。",
      [TAgentRole.CODER]:
        "你是编码者代理，负责编写和审查代码。你的目标是创建高质量、高效的软件实现。",
      [TAgentRole.TESTER]:
        "你是测试者代理，负责验证解决方案的质量。你的目标是找出潜在问题并确保解决方案符合要求。",
    };

    return (
      templates[role] || "你是一个AI代理，请基于你的能力和知识帮助解决问题。"
    );
  };

  // 当角色改变时更新系统消息模板
  useEffect(() => {
    if (!initialData.systemMessage && !formData.systemMessage.trim()) {
      setFormData((prev) => ({
        ...prev,
        systemMessage: getRoleSystemMessageTemplate(prev.role),
      }));
    }
  }, [formData.role, initialData.systemMessage]);

  // 角色映射到中文显示名称
  const roleDisplayNames: Record<TAgentRole, string> = {
    [TAgentRole.USER]: "用户",
    [TAgentRole.ASSISTANT]: "助手",
    [TAgentRole.ORCHESTRATOR]: "协调者",
    [TAgentRole.EXECUTOR]: "执行者",
    [TAgentRole.PLANNER]: "规划者",
    [TAgentRole.CRITIC]: "批评者",
    [TAgentRole.RESEARCHER]: "研究者",
    [TAgentRole.CODER]: "编码者",
    [TAgentRole.TESTER]: "测试者",
  };

  // 角色映射到默认颜色
  const roleDefaultColors: Record<TAgentRole, string> = {
    [TAgentRole.USER]: "#4f46e5", // 深靛青色
    [TAgentRole.ASSISTANT]: "#16a34a", // 绿色
    [TAgentRole.ORCHESTRATOR]: "#8b5cf6", // 紫色
    [TAgentRole.EXECUTOR]: "#0891b2", // 青色
    [TAgentRole.PLANNER]: "#6366f1", // 靛青色
    [TAgentRole.CRITIC]: "#dc2626", // 红色
    [TAgentRole.RESEARCHER]: "#eab308", // 黄色
    [TAgentRole.CODER]: "#2563eb", // 蓝色
    [TAgentRole.TESTER]: "#ea580c", // 橙色
  };

  // 当角色改变时更新默认颜色
  useEffect(() => {
    if (!initialData.color) {
      setFormData((prev) => ({
        ...prev,
        color: roleDefaultColors[prev.role],
      }));
    }
  }, [formData.role, initialData.color]);

  return (
    <Card className="max-w-3xl mx-auto" data-oid="3s17ql5">
      <form onSubmit={handleSubmit} className="space-y-6" data-oid="z78z_p-">
        <h2
          className="text-xl font-semibold text-indigo-300 mb-4"
          data-oid="3f_zyfl"
        >
          {initialData.id ? "编辑代理" : "创建新代理"}
        </h2>

        {error && (
          <div
            className="bg-red-900/50 border border-red-700 text-white p-4 rounded-md"
            data-oid="k_z:tad"
          >
            <p className="font-semibold" data-oid="6j6j967">
              错误
            </p>
            <p data-oid="h985igz">{error}</p>
          </div>
        )}

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          data-oid="ik2x-ch"
        >
          {/* 代理名称 */}
          <div className="col-span-1" data-oid="rt9t447">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="o8s9g.4"
            >
              代理名称{" "}
              <span className="text-red-500" data-oid="4hbuabp">
                *
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入代理名称"
              required
              data-oid="r_wuy-9"
            />
          </div>

          {/* 代理角色 */}
          <div className="col-span-1" data-oid="dpybg16">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="o:mesxu"
            >
              代理角色{" "}
              <span className="text-red-500" data-oid="ir:kuk.">
                *
              </span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              data-oid="xbl:ldh"
            >
              {Object.values(TAgentRole).map((role) => (
                <option key={role} value={role} data-oid="1aw:rk9">
                  {roleDisplayNames[role]} ({role})
                </option>
              ))}
            </select>
          </div>

          {/* 代理描述 */}
          <div className="col-span-2" data-oid="kzh60j7">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="2avh7xn"
            >
              代理描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="描述代理的功能和特点"
              data-oid="p46xn4l"
            />
          </div>

          {/* 系统消息 */}
          <div className="col-span-2" data-oid="w5:vm2b">
            <label
              htmlFor="systemMessage"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="lnky5uu"
            >
              系统消息{" "}
              <span className="text-red-500" data-oid="pqk1rpp">
                *
              </span>
            </label>
            <textarea
              id="systemMessage"
              name="systemMessage"
              value={formData.systemMessage}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入代理的系统指令消息"
              required
              data-oid="1oam8bc"
            />

            <p className="text-xs text-gray-400 mt-1" data-oid="f_k818b">
              系统消息定义了代理的行为、技能和限制
            </p>
          </div>

          {/* 代理颜色 */}
          <div className="col-span-1" data-oid="2lxcffe">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="iosonza"
            >
              代理颜色
            </label>
            <div className="flex items-center" data-oid="82al_04">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-10 h-10 bg-transparent rounded-md cursor-pointer"
                data-oid="fz3bork"
              />

              <input
                type="text"
                value={formData.color}
                onChange={handleChange}
                name="color"
                className="ml-2 w-28 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-oid="b3cllpv"
              />
            </div>
          </div>
        </div>

        {/* LLM配置 */}
        <div className="space-y-4" data-oid="9:7-ft7">
          <h3
            className="text-md font-medium text-indigo-300"
            data-oid="f6yymw1"
          >
            LLM配置
          </h3>

          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            data-oid="jv3mhgc"
          >
            {/* 模型 */}
            <div data-oid=".4wh4ln">
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-300 mb-1"
                data-oid="o:bulj7"
              >
                模型
              </label>
              <select
                id="model"
                name="model"
                value={formData.llmConfig?.model}
                onChange={handleLlmConfigChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-oid="0rreygo"
              >
                <option value="gpt-4" data-oid="olpxpjs">
                  GPT-4
                </option>
                <option value="gpt-4-turbo" data-oid="s3o8bhs">
                  GPT-4 Turbo
                </option>
                <option value="gpt-3.5-turbo" data-oid="8a1oz::">
                  GPT-3.5 Turbo
                </option>
                <option value="claude-3-opus" data-oid="p:ppwgh">
                  Claude 3 Opus
                </option>
                <option value="claude-3-sonnet" data-oid="4fcio4x">
                  Claude 3 Sonnet
                </option>
                <option value="gemini-pro" data-oid="18l2w7o">
                  Gemini Pro
                </option>
              </select>
            </div>

            {/* 温度 */}
            <div data-oid="c6dj6pd">
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-300 mb-1"
                data-oid="2k4wjj1"
              >
                温度：{formData.llmConfig?.temperature || 0}
              </label>
              <input
                type="range"
                id="temperature"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                value={formData.llmConfig?.temperature || 0}
                onChange={handleLlmConfigChange}
                className="w-full bg-gray-700 rounded-lg appearance-none cursor-pointer"
                data-oid="v-bvgbl"
              />

              <div
                className="flex justify-between text-xs text-gray-400 mt-1"
                data-oid="zrh1flx"
              >
                <span data-oid="4du8x1m">精确</span>
                <span data-oid="5ke789i">创造</span>
              </div>
            </div>

            {/* 最大生成长度 */}
            <div data-oid="_dhed5b">
              <label
                htmlFor="maxTokens"
                className="block text-sm font-medium text-gray-300 mb-1"
                data-oid="_fib._h"
              >
                最大长度：{formData.llmConfig?.maxTokens || 1000}
              </label>
              <input
                type="range"
                id="maxTokens"
                name="maxTokens"
                min="100"
                max="4000"
                step="100"
                value={formData.llmConfig?.maxTokens || 1000}
                onChange={handleLlmConfigChange}
                className="w-full bg-gray-700 rounded-lg appearance-none cursor-pointer"
                data-oid="tqt.-kh"
              />

              <div
                className="flex justify-between text-xs text-gray-400 mt-1"
                data-oid="dclb22l"
              >
                <span data-oid="jrkullg">简短</span>
                <span data-oid="87eqkr4">详细</span>
              </div>
            </div>
          </div>
        </div>

        {/* 工具选择 */}
        {availableTools.length > 0 && (
          <div className="space-y-4" data-oid="16xri6y">
            <h3
              className="text-md font-medium text-indigo-300"
              data-oid="20yy4zl"
            >
              可用工具
            </h3>

            <div
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
              data-oid="l1i5.6d"
            >
              {availableTools.map((tool) => (
                <div
                  key={tool.id}
                  className={`flex items-center p-2 border rounded-md cursor-pointer transition-colors ${
                    selectedTools.has(tool.id)
                      ? "bg-indigo-900/50 border-indigo-500"
                      : "bg-gray-800/50 border-gray-700 hover:border-indigo-500/50"
                  }`}
                  onClick={() => handleToolToggle(tool.id)}
                  data-oid="ms:yflb"
                >
                  <input
                    type="checkbox"
                    checked={selectedTools.has(tool.id)}
                    onChange={() => {}}
                    className="mr-2 accent-indigo-600 h-4 w-4"
                    data-oid="gt011gn"
                  />

                  <div data-oid="l:8ifcc">
                    <p
                      className="text-sm font-medium text-white"
                      data-oid="7er.pa."
                    >
                      {tool.name}
                    </p>
                    <p
                      className="text-xs text-gray-400 line-clamp-1"
                      data-oid="5xw6x48"
                    >
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 按钮区域 */}
        <div className="flex justify-end space-x-3 pt-3" data-oid="aippc57">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              data-oid="2izkfxw"
            >
              取消
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            data-oid="i0v-1.b"
          >
            {isSubmitting
              ? "保存中..."
              : initialData.id
                ? "保存代理"
                : "创建代理"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AgentForm;
