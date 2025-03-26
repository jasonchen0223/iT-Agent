// app/integrations/page.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";

export default function IntegrationsPage() {
  return (
    <>
      <StarBackground data-oid="wr8p5:l" />
      <div className="min-h-screen flex flex-col" data-oid="z2_bf43">
        <Header data-oid="7spbosw" />

        {/* 工具集成导航栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="7ce6snc">
          <div className="container mx-auto" data-oid="ieum1kr">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="58x-gob"
            >
              工具集成
            </h1>
            <div className="flex space-x-4 mt-2" data-oid=".iwhaha">
              <button
                className="px-4 py-1 bg-indigo-700/50 text-white rounded-md"
                data-oid="f:hdvit"
              >
                所有工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="rmh:q_w"
              >
                开发工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="huqgzoo"
              >
                分析工具
              </button>
              <button
                className="px-4 py-1 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                data-oid="epuo.m3"
              >
                通信工具
              </button>
            </div>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="-zqvowj">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="xm:vjy5"
          >
            {/* 左侧工具目录 */}
            <div className="md:col-span-3 space-card" data-oid="7.a0cfx">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="c26.045"
              >
                工具目录
              </h2>
              <div className="space-y-1" data-oid="7ix:axn">
                <div
                  className="p-2 bg-indigo-700/30 rounded-md text-white"
                  data-oid="cwx.i32"
                >
                  MCP Agent
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="y1hcthm"
                >
                  代码分析器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="1jw7_oy"
                >
                  文档生成器
                </div>
                <div
                  className="p-2 text-indigo-300 hover:bg-indigo-700/20 rounded-md"
                  data-oid="0-hdzr:"
                >
                  API测试工具
                </div>
              </div>
            </div>

            {/* 中央工具详情 */}
            <div className="md:col-span-6 space-card" data-oid="tz8ez:y">
              <div className="flex items-center mb-4" data-oid="92ycfdo">
                <div
                  className="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center mr-3"
                  data-oid="36tmed_"
                >
                  <span className="text-white font-semibold" data-oid="qikj-gc">
                    M
                  </span>
                </div>
                <div data-oid="5u09j85">
                  <h2
                    className="text-xl font-semibold text-indigo-100"
                    data-oid="..ocjk:"
                  >
                    MCP Agent
                  </h2>
                  <p className="text-indigo-300/70" data-oid="gg3l88x">
                    Model Context Protocol 实现
                  </p>
                </div>
                <div className="ml-auto" data-oid="fogjqsh">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="5ftzeh5"
                  >
                    已连接
                  </span>
                </div>
              </div>

              <div
                className="p-4 bg-indigo-900/20 rounded-md mb-4"
                data-oid=":sht6_v"
              >
                <p className="text-indigo-100" data-oid="pzj5-5e">
                  MCP Agent
                  提供了丰富的工具集，帮助智能代理执行各种任务，包括代码操作、终端命令执行和外部API调用等。
                </p>
              </div>

              <h3
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="32_c0wd"
              >
                工具配置
              </h3>
              <div className="space-y-4" data-oid="u_3hcr5">
                <div className="grid grid-cols-2 gap-4" data-oid="k0su_8f">
                  <div data-oid="a_blvn9">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="ajzs28x"
                    >
                      API密钥
                    </label>
                    <input
                      type="password"
                      defaultValue="********"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid="ft_p7ua"
                    />
                  </div>
                  <div data-oid="cejieio">
                    <label
                      className="text-indigo-100 block mb-1"
                      data-oid="3rm066x"
                    >
                      超时设置(秒)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full bg-indigo-900/20 text-indigo-100 p-2 rounded-md border border-indigo-800/30"
                      data-oid="x_6r49t"
                    />
                  </div>
                </div>

                <div data-oid="5is0wjp">
                  <label
                    className="text-indigo-100 block mb-1"
                    data-oid="y69ia0-"
                  >
                    可用工具
                  </label>
                  <div
                    className="p-3 bg-indigo-900/30 rounded-md grid grid-cols-3 gap-2"
                    data-oid="-5br.x7"
                  >
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="uku9:4_"
                    >
                      文件搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="752tfq5"
                    >
                      代码编辑
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="zf52ih:"
                    >
                      终端命令
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="61jbr8r"
                    >
                      网络搜索
                    </span>
                    <span
                      className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full text-center"
                      data-oid="w9lcumm"
                    >
                      API调用
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="flex justify-end mt-4 space-x-3"
                data-oid="r_eob_m"
              >
                <button
                  className="px-4 py-2 border border-indigo-500 text-indigo-100 rounded-md"
                  data-oid="2qtv8by"
                >
                  测试连接
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                  data-oid="5da19od"
                >
                  保存配置
                </button>
              </div>
            </div>

            {/* 右侧状态监控 */}
            <div className="md:col-span-3 space-card" data-oid="cw-pabk">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="ihigvo-"
              >
                状态监控
              </h2>

              <div
                className="p-3 bg-indigo-900/20 rounded-md mb-4"
                data-oid="1gxptlo"
              >
                <div
                  className="flex justify-between items-center mb-1"
                  data-oid="xfgw5ix"
                >
                  <span className="text-indigo-100" data-oid="h0usdd7">
                    CPU使用率
                  </span>
                  <span className="text-indigo-300" data-oid="ug3vqxj">
                    23%
                  </span>
                </div>
                <div
                  className="w-full bg-indigo-900/30 h-2 rounded-full"
                  data-oid="2yl5cn8"
                >
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "23%" }}
                    data-oid="kgiyap:"
                  ></div>
                </div>
              </div>

              <div
                className="p-3 bg-indigo-900/20 rounded-md mb-4"
                data-oid="m229c.q"
              >
                <div
                  className="flex justify-between items-center mb-1"
                  data-oid="7eqfxsr"
                >
                  <span className="text-indigo-100" data-oid="bo56glt">
                    内存使用率
                  </span>
                  <span className="text-indigo-300" data-oid="0:-g.m8">
                    45%
                  </span>
                </div>
                <div
                  className="w-full bg-indigo-900/30 h-2 rounded-full"
                  data-oid="rmr.0r_"
                >
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "45%" }}
                    data-oid="r8hw:2u"
                  ></div>
                </div>
              </div>

              <h3
                className="text-sm font-semibold text-indigo-100 mb-2"
                data-oid="xc06uno"
              >
                最近调用
              </h3>
              <div className="space-y-2" data-oid="-:scjxe">
                <div
                  className="p-2 bg-indigo-900/20 rounded-md text-xs"
                  data-oid="flitks1"
                >
                  <p className="text-indigo-100" data-oid="bd:mln5">
                    文件搜索: src/components/
                  </p>
                  <p className="text-indigo-300/70" data-oid="v4plfwy">
                    2分钟前
                  </p>
                </div>
                <div
                  className="p-2 bg-indigo-900/20 rounded-md text-xs"
                  data-oid="xxt37u:"
                >
                  <p className="text-indigo-100" data-oid=".enlqn_">
                    代码编辑: app/page.tsx
                  </p>
                  <p className="text-indigo-300/70" data-oid="o:nhwgu">
                    15分钟前
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="ji610bb" />
      </div>
    </>
  );
}
