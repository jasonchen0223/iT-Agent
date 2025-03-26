import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

/**
 * 会话表单属性接口
 */
export interface ISessionFormProps {
  /**
   * 提交事件
   */
  onSubmit: (sessionData: ISessionFormData) => void;
  /**
   * 取消事件
   */
  onCancel?: () => void;
  /**
   * 是否提交中
   */
  isSubmitting?: boolean;
  /**
   * 初始会话数据
   */
  initialData?: Partial<ISessionFormData>;
}

/**
 * 会话表单数据接口
 */
export interface ISessionFormData {
  /**
   * 会话名称
   */
  name: string;
  /**
   * 会话描述
   */
  description: string;
  /**
   * 代理配置
   */
  agentConfigs: {
    /**
     * 代理类型
     */
    type: string;
    /**
     * 代理数量
     */
    count: number;
  }[];
}

/**
 * 会话表单组件
 *
 * 用于创建或编辑会话
 *
 * @param {ISessionFormProps} props - 会话表单属性
 * @returns {React.ReactElement} 会话表单组件
 */
const SessionForm: React.FC<ISessionFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData = {},
}) => {
  const [formData, setFormData] = useState<ISessionFormData>({
    name: initialData.name || "",
    description: initialData.description || "",
    agentConfigs: initialData.agentConfigs || [
      { type: "user", count: 1 },
      { type: "assistant", count: 1 },
    ],
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAgentConfigChange = (
    index: number,
    field: "type" | "count",
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newAgentConfigs = [...prev.agentConfigs];
      newAgentConfigs[index] = {
        ...newAgentConfigs[index],
        [field]: field === "count" ? Number(value) : value,
      };
      return { ...prev, agentConfigs: newAgentConfigs };
    });
    setError(null);
  };

  const addAgentConfig = () => {
    setFormData((prev) => ({
      ...prev,
      agentConfigs: [...prev.agentConfigs, { type: "assistant", count: 1 }],
    }));
  };

  const removeAgentConfig = (index: number) => {
    if (formData.agentConfigs.length <= 2) {
      setError("至少需要两个代理配置");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      agentConfigs: prev.agentConfigs.filter((_, i) => i !== index),
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("会话名称不能为空");
      return;
    }

    if (formData.agentConfigs.length < 2) {
      setError("至少需要两个代理配置");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4">
          {initialData.name ? "编辑会话" : "创建新会话"}
        </h2>

        {/* 会话基本信息 */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              会话名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入会话名称"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              会话描述
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="描述这个会话的目的和功能"
            />
          </div>
        </div>

        {/* 代理配置 */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-medium text-gray-300">代理配置</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAgentConfig}
            >
              添加代理
            </Button>
          </div>

          <div className="space-y-3">
            {formData.agentConfigs.map((config, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-md"
              >
                <div className="flex-grow">
                  <label className="block text-xs text-gray-400 mb-1">
                    代理类型
                  </label>
                  <select
                    value={config.type}
                    onChange={(e) =>
                      handleAgentConfigChange(index, "type", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="user">用户代理</option>
                    <option value="assistant">助手代理</option>
                    <option value="tool">工具代理</option>
                    <option value="executor">执行代理</option>
                  </select>
                </div>

                <div className="w-24">
                  <label className="block text-xs text-gray-400 mb-1">
                    数量
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={config.count}
                    onChange={(e) =>
                      handleAgentConfigChange(index, "count", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeAgentConfig(index)}
                  className="p-1 text-gray-400 hover:text-red-400 self-end"
                  title="删除代理"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 错误信息 */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* 按钮组 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting
              ? "提交中..."
              : initialData.name
                ? "保存修改"
                : "创建会话"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SessionForm;
