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
    <Card className="max-w-2xl mx-auto" data-oid="ic2b98c">
      <form onSubmit={handleSubmit} className="space-y-6" data-oid="qyrlncj">
        <h2
          className="text-xl font-semibold text-indigo-300 mb-4"
          data-oid="k6f1yko"
        >
          {initialData.name ? "编辑会话" : "创建新会话"}
        </h2>

        {/* 会话基本信息 */}
        <div className="space-y-4" data-oid="_umbs74">
          <div data-oid="f2.muqs">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="--pd:5-"
            >
              会话名称{" "}
              <span className="text-red-500" data-oid="q27tpgp">
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
              placeholder="输入会话名称"
              data-oid=".r4ndjb"
            />
          </div>

          <div data-oid="rdgaguy">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-1"
              data-oid="e5bzr35"
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
              data-oid="-e4o-qv"
            />
          </div>
        </div>

        {/* 代理配置 */}
        <div data-oid="6v69lpc">
          <div
            className="flex justify-between items-center mb-3"
            data-oid="-n928tl"
          >
            <h3
              className="text-md font-medium text-gray-300"
              data-oid="tq_0nei"
            >
              代理配置
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAgentConfig}
              data-oid="0sfmmev"
            >
              添加代理
            </Button>
          </div>

          <div className="space-y-3" data-oid="6apohxd">
            {formData.agentConfigs.map((config, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-md"
                data-oid="t8w9.ce"
              >
                <div className="flex-grow" data-oid="_22x6x_">
                  <label
                    className="block text-xs text-gray-400 mb-1"
                    data-oid="bj7d718"
                  >
                    代理类型
                  </label>
                  <select
                    value={config.type}
                    onChange={(e) =>
                      handleAgentConfigChange(index, "type", e.target.value)
                    }
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    data-oid="9yqa6zz"
                  >
                    <option value="user" data-oid="imbhv3_">
                      用户代理
                    </option>
                    <option value="assistant" data-oid="65ova8e">
                      助手代理
                    </option>
                    <option value="tool" data-oid="dajge7b">
                      工具代理
                    </option>
                    <option value="executor" data-oid=".lmj9p7">
                      执行代理
                    </option>
                  </select>
                </div>

                <div className="w-24" data-oid="_lx2ydq">
                  <label
                    className="block text-xs text-gray-400 mb-1"
                    data-oid="e3gld6z"
                  >
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
                    data-oid="_:aiqpm"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeAgentConfig(index)}
                  className="p-1 text-gray-400 hover:text-red-400 self-end"
                  title="删除代理"
                  data-oid="_pl-673"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    data-oid="86m58rq"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                      data-oid="fgfdy12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="text-red-500 text-sm" data-oid="0qyl0kq">
            {error}
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex justify-end gap-3 pt-4" data-oid="3-04d6_">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            data-oid="8gseysq"
          >
            取消
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
            data-oid="77.ifbh"
          >
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
