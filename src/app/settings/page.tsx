// app/settings/page.tsx
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-indigo-100 mb-6">系统设置</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 左侧导航 */}
        <div className="md:col-span-3 space-card">
          <nav className="space-y-2">
            <a
              href="#general"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
            >
              通用设置
            </a>
            <a
              href="#api"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              API 配置
            </a>
            <a
              href="#theme"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              主题设置
            </a>
            <a
              href="#agents"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              代理配置
            </a>
            <a
              href="#integrations"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              工具集成
            </a>
            <a
              href="#notifications"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
            >
              通知设置
            </a>
          </nav>
        </div>

        {/* 右侧设置内容 */}
        <div className="md:col-span-9 space-card">
          <h2
            id="general"
            className="text-xl font-semibold text-indigo-100 mb-4"
          >
            通用设置
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-indigo-100 block">系统语言</label>
              <select className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500">
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English (US)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-indigo-100 block">时区</label>
              <select className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500">
                <option value="Asia/Shanghai">Asia/Shanghai (GMT+8)</option>
                <option value="America/Los_Angeles">
                  America/Los_Angeles (GMT-7)
                </option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-indigo-100 block">日期格式</label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="date-ymd"
                    name="date-format"
                    defaultChecked
                    className="text-indigo-600"
                  />

                  <label htmlFor="date-ymd" className="text-indigo-100">
                    YYYY-MM-DD
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="date-mdy"
                    name="date-format"
                    className="text-indigo-600"
                  />

                  <label htmlFor="date-mdy" className="text-indigo-100">
                    MM/DD/YYYY
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="date-dmy"
                    name="date-format"
                    className="text-indigo-600"
                  />

                  <label htmlFor="date-dmy" className="text-indigo-100">
                    DD/MM/YYYY
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-indigo-900/20 rounded-md">
              <div>
                <h3 className="text-indigo-100 font-medium">自动保存</h3>
                <p className="text-indigo-300/70 text-sm">
                  每5分钟自动保存项目更改
                </p>
              </div>
              <div className="relative inline-block h-6 w-11 rounded-full bg-indigo-800/50">
                <input
                  type="checkbox"
                  id="auto-save"
                  defaultChecked
                  className="sr-only peer"
                />

                <span className="absolute inset-y-0 left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white peer-checked:bg-indigo-500 peer-checked:left-5 transition-all"></span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button>保存设置</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
