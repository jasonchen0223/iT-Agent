// app/settings/page.tsx
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8" data-oid="46kef8n">
      <h1
        className="text-2xl font-bold text-indigo-100 mb-6"
        data-oid="79:h.mn"
      >
        系统设置
      </h1>

      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="c2sen5b"
      >
        {/* 左侧导航 */}
        <div className="md:col-span-3 space-card" data-oid="xxuljx9">
          <nav className="space-y-2" data-oid="8r0v9pq">
            <a
              href="#general"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
              data-oid="dy_ngiy"
            >
              通用设置
            </a>
            <a
              href="#api"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="urg_hvn"
            >
              API 配置
            </a>
            <a
              href="#theme"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="iqb1-mx"
            >
              主题设置
            </a>
            <a
              href="#agents"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="m-2b884"
            >
              代理配置
            </a>
            <a
              href="#integrations"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="zz1.e2_"
            >
              工具集成
            </a>
            <a
              href="#notifications"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="58hr1cx"
            >
              通知设置
            </a>
          </nav>
        </div>

        {/* 右侧设置内容 */}
        <div className="md:col-span-9 space-card" data-oid="2t8ks5s">
          <h2
            id="general"
            className="text-xl font-semibold text-indigo-100 mb-4"
            data-oid="nlbrvu9"
          >
            通用设置
          </h2>

          <div className="space-y-6" data-oid="g2y2t44">
            <div className="space-y-2" data-oid="kzb.ea7">
              <label className="text-indigo-100 block" data-oid="mqxo7jj">
                系统语言
              </label>
              <select
                className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                data-oid="7ujd5f3"
              >
                <option value="zh-CN" data-oid=":d6-yw5">
                  简体中文
                </option>
                <option value="en-US" data-oid="9jtvw-o">
                  English (US)
                </option>
              </select>
            </div>

            <div className="space-y-2" data-oid="ekxc:ap">
              <label className="text-indigo-100 block" data-oid="dvv-08q">
                时区
              </label>
              <select
                className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                data-oid="0:tccrv"
              >
                <option value="Asia/Shanghai" data-oid="ooou5oz">
                  Asia/Shanghai (GMT+8)
                </option>
                <option value="America/Los_Angeles" data-oid="2t4n3b-">
                  America/Los_Angeles (GMT-7)
                </option>
                <option value="Europe/London" data-oid="1afmc6m">
                  Europe/London (GMT+0)
                </option>
              </select>
            </div>

            <div className="space-y-2" data-oid="jjgq5vk">
              <label className="text-indigo-100 block" data-oid="wsc18h.">
                日期格式
              </label>
              <div className="flex space-x-4" data-oid="xpkchqp">
                <div className="flex items-center space-x-2" data-oid=":twdb1k">
                  <input
                    type="radio"
                    id="date-ymd"
                    name="date-format"
                    defaultChecked
                    className="text-indigo-600"
                    data-oid="ead:o01"
                  />

                  <label
                    htmlFor="date-ymd"
                    className="text-indigo-100"
                    data-oid="cy:nyo:"
                  >
                    YYYY-MM-DD
                  </label>
                </div>
                <div className="flex items-center space-x-2" data-oid="v:mdm6j">
                  <input
                    type="radio"
                    id="date-mdy"
                    name="date-format"
                    className="text-indigo-600"
                    data-oid="y6c7vle"
                  />

                  <label
                    htmlFor="date-mdy"
                    className="text-indigo-100"
                    data-oid="ou4qno5"
                  >
                    MM/DD/YYYY
                  </label>
                </div>
                <div className="flex items-center space-x-2" data-oid="qiu3.e8">
                  <input
                    type="radio"
                    id="date-dmy"
                    name="date-format"
                    className="text-indigo-600"
                    data-oid="0p3d6mg"
                  />

                  <label
                    htmlFor="date-dmy"
                    className="text-indigo-100"
                    data-oid="k61r570"
                  >
                    DD/MM/YYYY
                  </label>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 bg-indigo-900/20 rounded-md"
              data-oid="sdpzvxq"
            >
              <div data-oid="y-3fmct">
                <h3 className="text-indigo-100 font-medium" data-oid="8c3j9vk">
                  自动保存
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="88_gxuz">
                  每5分钟自动保存项目更改
                </p>
              </div>
              <div
                className="relative inline-block h-6 w-11 rounded-full bg-indigo-800/50"
                data-oid="1::inx4"
              >
                <input
                  type="checkbox"
                  id="auto-save"
                  defaultChecked
                  className="sr-only peer"
                  data-oid="n59.5:-"
                />

                <span
                  className="absolute inset-y-0 left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white peer-checked:bg-indigo-500 peer-checked:left-5 transition-all"
                  data-oid="eghbgnj"
                ></span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6" data-oid="sdm9w4t">
            <Button data-oid="yqrcpz:">保存设置</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
