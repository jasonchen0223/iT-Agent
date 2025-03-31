// app/integrations/page.tsx
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";

export default function IntegrationsPage() {
  return (
    <>
      <StarBackground data-oid="02zrabv" />
      <div className="min-h-screen flex flex-col" data-oid="1iwq2ss">
        {/* 工具集成导航栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="12fy-jh">
          <div className="container mx-auto" data-oid="jwbfchu">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid=".6:mn6e"
            >
              工具集成
            </h1>
            <div className="flex space-x-4 mt-2" data-oid="pjxvnfl">
              <button
                className="px-4 py-1 bg-indigo-700/50 text-white rounded-md"
                data-oid="_ohlj6e"
              >
                所有工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="u2r2wf1"
              >
                开发工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="w_y68t1"
              >
                分析工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="i3o7a5e"
              >
                通信工具
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="c0b1u::">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="eadii8s"
          >
            {/* 左侧工具目录 */}
            <div className="md:col-span-3 space-card" data-oid="uo9:2ts">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="yx6hyj4"
              >
                工具目录
              </h2>
              <div className="space-y-1" data-oid="h14fiq:">
                <div
                  className="p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid="s.hwb20"
                >
                  MCP Agent
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="6qmvnwd"
                >
                  代码分析器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="ffe05e1"
                >
                  文档生成器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="384j3xd"
                >
                  API测试工具
                </div>
              </div>
            </div>

            {/* 中央工具详情 */}
            <div className="md:col-span-6 space-card" data-oid="3pe7kvh">
              <div className="flex items-center mb-4" data-oid="05wbzy2">
                <div
                  className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center mr-3"
                  data-oid="e04ca0z"
                >
                  <span className="text-white font-semibold" data-oid="ugy_:7k">
                    M
                  </span>
                </div>
                <div data-oid="ohy8_xt">
                  <h2
                    className="text-xl font-semibold text-indigo-100"
                    data-oid="9grqe36"
                  >
                    MCP Agent
                  </h2>
                  <p className="text-indigo-300/70" data-oid="m4bokz5">
                    Model Context Protocol 实现
                  </p>
                </div>
                <div className="ml-auto" data-oid="22injpl">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="5ru0osv"
                  >
                    已连接
                  </span>
                </div>
              </div>

              <div
                className="p-4 bg-indigo-900/20 rounded-md mb-4"
                data-oid="c3d:ay3"
              >
                <p className="text-indigo-100" data-oid="z2sjimg">
                  MCP Agent
                  提供了丰富的工具集，帮助智能代理执行各种任务，包括代码操作、终端命令执行和外部API调用等。
                </p>
              </div>

              <h3
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="va8c2au"
              >
                工具配置
              </h3>
              <div className="space-y-4" data-oid="qst9ge-">
                <div className="grid grid-cols-2 gap-4" data-oid="bzc5ngl">
                  <div data-oid="7zcowz1">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="xsf7oyg"
                    >
                      API密钥
                    </label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid=".e4m-:y"
                    />
                  </div>
                  <div data-oid="rk6m6ib">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="5926f.y"
                    >
                      超时设置(秒)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid="x4f31.i"
                    />
                  </div>
                </div>

                <div data-oid="o:iu5vj">
                  <label
                    className="text-indigo-100 block mb-1"
                    data-oid="4v_g_uz"
                  >
                    可用工具
                  </label>
                  <div
                    className="p-3 bg-indigo-900/30 rounded-md grid grid-cols-3 gap-2"
                    data-oid="yuk08vt"
                  >
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="8lnpz.h"
                    >
                      文件搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="gzhmr8b"
                    >
                      代码编辑
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="tei_j9z"
                    >
                      终端命令
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="vpr89tc"
                    >
                      网络搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="m5vl.d_"
                    >
                      API调用
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end mt-4 space-x-3"
                data-oid="-iiobe4"
              >
                <button
                  className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                  data-oid="zasiq_a"
                >
                  测试连接
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  data-oid="kj3i0-:"
                >
                  保存配置
                </button>
              </div>
            </div>

            {/* 右侧状态监控 */}
            <div className="md:col-span-3 space-card" data-oid="yw8z:f4">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="8p4hxr:"
              >
                状态监控
              </h2>

              <div
                className="p-3 bg-indigo-900/20 rounded-md mb-4"
                data-oid="fg10.uq"
              >
                <div
                  className="flex justify-between items-center mb-2"
                  data-oid="89rj.t1"
                >
                  <span className="text-indigo-300" data-oid="0.-vxkx">
                    连接状态
                  </span>
                  <span
                    className="text-green-400 flex items-center"
                    data-oid="6tvh5o:"
                  >
                    <span
                      className="w-2 h-2 rounded-full bg-green-400 mr-1"
                      data-oid="8rw76qm"
                    ></span>
                    在线
                  </span>
                </div>
                <div
                  className="flex justify-between items-center mb-2"
                  data-oid="qj9zqst"
                >
                  <span className="text-indigo-300" data-oid="p6k-n88">
                    最近活动
                  </span>
                  <span className="text-indigo-100" data-oid="87i.trl">
                    3分钟前
                  </span>
                </div>
                <div
                  className="flex justify-between items-center"
                  data-oid="yvx7oeo"
                >
                  <span className="text-indigo-300" data-oid="s-wd6yd">
                    当前版本
                  </span>
                  <span className="text-indigo-100" data-oid="ixdkq2y">
                    v2.4.1
                  </span>
                </div>
              </div>

              <h3
                className="text-md font-semibold text-indigo-100 mb-2"
                data-oid="30jwv0l"
              >
                工具性能
              </h3>
              <div
                className="p-3 bg-indigo-900/20 rounded-md"
                data-oid="p10h-l2"
              >
                <div className="mb-3" data-oid="-jjl1x3">
                  <div
                    className="flex justify-between text-xs mb-1"
                    data-oid="6vz9fwu"
                  >
                    <span className="text-indigo-300" data-oid="wuzgboi">
                      响应时间
                    </span>
                    <span className="text-indigo-100" data-oid="wblojg8">
                      245ms
                    </span>
                  </div>
                  <div
                    className="w-full bg-indigo-950/50 rounded-full h-1.5"
                    data-oid="89jwvgm"
                  >
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: "15%" }}
                      data-oid="dhdmjya"
                    ></div>
                  </div>
                </div>

                <div className="mb-3" data-oid="e.8tnhu">
                  <div
                    className="flex justify-between text-xs mb-1"
                    data-oid="tnf0:8w"
                  >
                    <span className="text-indigo-300" data-oid="z96xbqz">
                      API调用频率
                    </span>
                    <span className="text-indigo-100" data-oid="m82g96-">
                      42/min
                    </span>
                  </div>
                  <div
                    className="w-full bg-indigo-950/50 rounded-full h-1.5"
                    data-oid="j6dvzg0"
                  >
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full"
                      style={{ width: "65%" }}
                      data-oid="6e4xnxc"
                    ></div>
                  </div>
                </div>

                <div data-oid="4iuhx36">
                  <div
                    className="flex justify-between text-xs mb-1"
                    data-oid="yxn:3-7"
                  >
                    <span className="text-indigo-300" data-oid="mfn9j_3">
                      错误率
                    </span>
                    <span className="text-indigo-100" data-oid="hj94ql1">
                      0.8%
                    </span>
                  </div>
                  <div
                    className="w-full bg-indigo-950/50 rounded-full h-1.5"
                    data-oid="vzx7g6x"
                  >
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: "8%" }}
                      data-oid="hue0h:t"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
