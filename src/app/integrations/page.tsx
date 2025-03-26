// app/integrations/page.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";

export default function IntegrationsPage() {
  return (
    <>
      <StarBackground data-oid="fw7jl8-" />
      <div className="min-h-screen flex flex-col" data-oid="3psejhq">
        <Header data-oid="g7_qmzv" />

        {/* 工具集成导航栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="y3aez1j">
          <div className="container mx-auto" data-oid="jfqu:ce">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="2ng2zzc"
            >
              工具集成
            </h1>
            <div className="flex space-x-4 mt-2" data-oid="b4.kc5_">
              <button
                className="px-4 py-1 bg-indigo-700/50 text-white rounded-md"
                data-oid="cc9wrvs"
              >
                所有工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="lmqs2am"
              >
                开发工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="6_lcmk0"
              >
                分析工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="g6kmuri"
              >
                通信工具
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="wij:7je">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="wlzddn0"
          >
            {/* 左侧工具目录 */}
            <div className="md:col-span-3 space-card" data-oid="kek-1d8">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="mu:8r25"
              >
                工具目录
              </h2>
              <div className="space-y-1" data-oid="l2h:7d.">
                <div
                  className="p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid="4u648y-"
                >
                  MCP Agent
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="d1f_sss"
                >
                  代码分析器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="mts9pqv"
                >
                  文档生成器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="fu_hbj_"
                >
                  API测试工具
                </div>
              </div>
            </div>

            {/* 中央工具详情 */}
            <div className="md:col-span-6 space-card" data-oid="vuzi39m">
              <div className="flex items-center mb-4" data-oid="91deodj">
                <div
                  className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center mr-3"
                  data-oid=":ead5_m"
                >
                  <span className="text-white font-semibold" data-oid="o:fp1xg">
                    M
                  </span>
                </div>
                <div data-oid="pg0v3hu">
                  <h2
                    className="text-xl font-semibold text-indigo-100"
                    data-oid="h9z0:k5"
                  >
                    MCP Agent
                  </h2>
                  <p className="text-indigo-300/70" data-oid="2qzmrhd">
                    Model Context Protocol 实现
                  </p>
                </div>
                <div className="ml-auto" data-oid="34gmh6z">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="jvy47h6"
                  >
                    已连接
                  </span>
                </div>
              </div>

              <div
                className="p-4 bg-indigo-900/20 rounded-md mb-4"
                data-oid=".mknqa7"
              >
                <p className="text-indigo-100" data-oid=":mghphn">
                  MCP Agent
                  提供了丰富的工具集，帮助智能代理执行各种任务，包括代码操作、终端命令执行和外部API调用等。
                </p>
              </div>

              <h3
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="0z7vv2s"
              >
                工具配置
              </h3>
              <div className="space-y-4" data-oid="frf0lt6">
                <div className="grid grid-cols-2 gap-4" data-oid="sih7bc5">
                  <div data-oid="6rmchid">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="4-t8d_:"
                    >
                      API密钥
                    </label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid="bx-eq6:"
                    />
                  </div>
                  <div data-oid="6cl0sbo">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="kr.egj1"
                    >
                      超时设置(秒)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid="zac60g1"
                    />
                  </div>
                </div>

                <div data-oid="o4yfu4z">
                  <label
                    className="text-indigo-100 block mb-1"
                    data-oid="411.zsd"
                  >
                    可用工具
                  </label>
                  <div
                    className="p-3 bg-indigo-900/30 rounded-md grid grid-cols-3 gap-2"
                    data-oid="f7i5a8d"
                  >
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="zbv3dsx"
                    >
                      文件搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="_0vak2k"
                    >
                      代码编辑
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="4_k21cc"
                    >
                      终端命令
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="k-1n3v:"
                    >
                      网络搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="99ffw26"
                    >
                      API调用
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end mt-4 space-x-3"
                data-oid="yg8ayq9"
              >
                <button
                  className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                  data-oid="b19ym6-"
                >
                  测试连接
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  data-oid="6au5fba"
                >
                  保存配置
                </button>
              </div>
            </div>

            {/* 右侧状态监控 */}
            <div className="md:col-span-3 space-card" data-oid="je-cq6:">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="rd47-h7"
              >
                状态监控
              </h2>

              <div
                className="p-3 bg-indigo-900/20 rounded-md mb-4"
                data-oid="h_8tjn7"
              >
                <div
                  className="flex justify-between items-center mb-1"
                  data-oid="g0m7kms"
                >
                  <span className="text-indigo-100" data-oid="o7yfooa">
                    CPU使用率
                  </span>
                  <span className="text-indigo-300" data-oid="60k_1di">
                    23%
                  </span>
                </div>
                <div
                  className="w-full bg-indigo-900/30 h-2 rounded-full"
                  data-oid="w9793te"
                >
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "23%" }}
                    data-oid=".9jslm8"
                  ></div>
                </div>
              </div>

              <div
                className="p-3 bg-indigo-900/20 rounded-md mb-4"
                data-oid="5er.n.3"
              >
                <div
                  className="flex justify-between items-center mb-1"
                  data-oid="oeqejgg"
                >
                  <span className="text-indigo-100" data-oid="q5a46y8">
                    内存使用率
                  </span>
                  <span className="text-indigo-300" data-oid="gn.5ukb">
                    45%
                  </span>
                </div>
                <div
                  className="w-full bg-indigo-900/30 h-2 rounded-full"
                  data-oid="qlg3b9r"
                >
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                    data-oid="7_-_2:3"
                  ></div>
                </div>
              </div>

              <h3
                className="text-sm font-semibold text-indigo-100 mb-2"
                data-oid="v2mv_90"
              >
                最近调用
              </h3>
              <div className="space-y-2" data-oid="9v7wn9.">
                <div
                  className="p-2 bg-indigo-900/20 rounded-md text-xs"
                  data-oid="i577:l5"
                >
                  <p className="text-indigo-100" data-oid="9szxr5w">
                    文件搜索: src/components/
                  </p>
                  <p className="text-indigo-300/70" data-oid="rmi0goi">
                    2分钟前
                  </p>
                </div>
                <div
                  className="p-2 bg-indigo-900/20 rounded-md text-xs"
                  data-oid="egobbe3"
                >
                  <p className="text-indigo-100" data-oid="3lkq4oo">
                    代码编辑: app/page.tsx
                  </p>
                  <p className="text-indigo-300/70" data-oid="2p0nq2c">
                    15分钟前
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="t-_thvo" />
      </div>
    </>
  );
}
