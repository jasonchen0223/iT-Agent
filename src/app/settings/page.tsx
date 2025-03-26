// app/settings/page.tsx
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8" data-oid="9-v.t9v">
      <h1
        className="text-2xl font-bold text-indigo-100 mb-6"
        data-oid="s4w.82j"
      >
        系统设置
      </h1>

      <div
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
        data-oid="979ilm5"
      >
        {/* 左侧导航 */}
        <div className="md:col-span-3 space-card" data-oid="fpoqczn">
          <nav className="space-y-2" data-oid="jscbdt3">
            <a
              href="#general"
              className="block p-2 bg-indigo-700/30 rounded-md text-white"
              data-oid="-0l5g81"
            >
              通用设置
            </a>
            <a
              href="#api"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="scvahqw"
            >
              API 配置
            </a>
            <a
              href="#theme"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="af-k13z"
            >
              主题设置
            </a>
            <a
              href="#agents"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="jkozz30"
            >
              代理配置
            </a>
            <a
              href="#integrations"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="vd7zbj_"
            >
              工具集成
            </a>
            <a
              href="#notifications"
              className="block p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
              data-oid="rc5rzc2"
            >
              通知设置
            </a>
          </nav>
        </div>

        {/* 右侧设置内容 */}
        <div className="md:col-span-9 space-card" data-oid="8d-a6jc">
          <h2
            id="general"
            className="text-xl font-semibold text-indigo-100 mb-4"
            data-oid="syui4wn"
          >
            通用设置
          </h2>

          <div className="space-y-6" data-oid="yjgv9x2">
            <div className="space-y-2" data-oid="-hd.189">
              <label className="text-indigo-100 block" data-oid="2c-1_hz">
                系统语言
              </label>
              <select
                className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                data-oid="d5n17fr"
              >
                <option value="zh-CN" data-oid="0saacty">
                  简体中文
                </option>
                <option value="en-US" data-oid="3z-7kux">
                  English (US)
                </option>
              </select>
            </div>

            <div className="space-y-2" data-oid="bx.o:8y">
              <label className="text-indigo-100 block" data-oid="b5suxmv">
                时区
              </label>
              <select
                className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                data-oid="e0dyjmx"
              >
                <option value="Asia/Shanghai" data-oid="xhwgdqb">
                  Asia/Shanghai (GMT+8)
                </option>
                <option value="America/Los_Angeles" data-oid="9w3pi.a">
                  America/Los_Angeles (GMT-7)
                </option>
                <option value="Europe/London" data-oid="v_lh8ut">
                  Europe/London (GMT+0)
                </option>
              </select>
            </div>

            <div className="space-y-2" data-oid="iqvxb.v">
              <label className="text-indigo-100 block" data-oid="igif35a">
                日期格式
              </label>
              <div className="flex space-x-4" data-oid="dby6wex">
                <div className="flex items-center space-x-2" data-oid="rsu4:j8">
                  <input
                    type="radio"
                    id="date-ymd"
                    name="date-format"
                    defaultChecked
                    className="text-indigo-600"
                    data-oid="8l54z.a"
                  />

                  <label
                    htmlFor="date-ymd"
                    className="text-indigo-100"
                    data-oid="264xp_s"
                  >
                    YYYY-MM-DD
                  </label>
                </div>
                <div className="flex items-center space-x-2" data-oid="qii_h7a">
                  <input
                    type="radio"
                    id="date-mdy"
                    name="date-format"
                    className="text-indigo-600"
                    data-oid="a-nwfos"
                  />

                  <label
                    htmlFor="date-mdy"
                    className="text-indigo-100"
                    data-oid="i-eg.j9"
                  >
                    MM/DD/YYYY
                  </label>
                </div>
                <div className="flex items-center space-x-2" data-oid="d6np:rg">
                  <input
                    type="radio"
                    id="date-dmy"
                    name="date-format"
                    className="text-indigo-600"
                    data-oid="1_a-.4z"
                  />

                  <label
                    htmlFor="date-dmy"
                    className="text-indigo-100"
                    data-oid="kd9aonv"
                  >
                    DD/MM/YYYY
                  </label>
                </div>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-4 bg-indigo-900/20 rounded-md"
              data-oid="jio6lqb"
            >
              <div data-oid="m9fqp98">
                <h3 className="text-indigo-100 font-medium" data-oid="w7rjjjg">
                  自动保存
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="yr-uasf">
                  每5分钟自动保存项目更改
                </p>
              </div>
              <div
                className="relative inline-block h-6 w-11 rounded-full bg-indigo-800/50"
                data-oid="3us5qjx"
              >
                <input
                  type="checkbox"
                  id="auto-save"
                  defaultChecked
                  className="sr-only peer"
                  data-oid="_8v2is_"
                />

                <span
                  className="absolute inset-y-0 left-0 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white peer-checked:bg-indigo-500 peer-checked:left-5 transition-all"
                  data-oid="y2jyvnq"
                ></span>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6" data-oid="04fd--m">
            <Button data-oid="y:jowqz">保存设置</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
