// app/collaboration/[id]/page.tsx
import Footer from "@/components/ui/Footer";
import StarBackground from "@/components/ui/StarBackground";

export default function CollaborationSession({
  params,
}: {
  params: { id: string };
}) {
  return (
    <>
      <StarBackground data-oid="kt-3y:1" />
      <div className="min-h-screen flex flex-col" data-oid="y25c2on">
        {/* 会话信息栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="gajq.lt">
          <div className="container mx-auto" data-oid="t26jgt4">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="t4ng7yf"
            >
              前端开发协作会话
            </h1>
            <p className="text-indigo-300/70" data-oid="vvejw7x">
              目标: 实现首页UI组件 • 进行中
            </p>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="t03j2id">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="a4dr:g7"
          >
            {/* 左侧参与代理列表 */}
            <div className="md:col-span-2 space-card" data-oid="-910rfb">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="2z7nzvn"
              >
                参与代理
              </h2>
              <div className="space-y-3" data-oid="7ramork">
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="x9b5_q2"
                >
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full mr-2"
                    data-oid="9ky6uu4"
                  ></div>
                  <span className="text-indigo-100" data-oid="oxyyt_9">
                    产品经理
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="cag:o:."
                >
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full mr-2"
                    data-oid="1sh:yph"
                  ></div>
                  <span className="text-indigo-100" data-oid="nu2tekp">
                    架构师
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="_srou2v"
                >
                  <div
                    className="w-3 h-3 bg-yellow-500 rounded-full mr-2"
                    data-oid="ee5wwy4"
                  ></div>
                  <span className="text-indigo-100" data-oid="c:7ye3t">
                    前端开发
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/20 rounded-md"
                  data-oid="z:bub_6"
                >
                  <div
                    className="w-3 h-3 bg-gray-500 rounded-full mr-2"
                    data-oid="2747ku0"
                  ></div>
                  <span className="text-indigo-300/70" data-oid="1nt4v-d">
                    测试工程师
                  </span>
                </div>
              </div>
            </div>

            {/* 中央消息流 */}
            <div className="md:col-span-7 space-card" data-oid="r3.6-5b">
              <div
                className="space-y-4 max-h-[600px] overflow-y-auto"
                data-oid="k-9q:r2"
              >
                {/* 代理消息 */}
                <div className="flex" data-oid="m6uw3en">
                  <div
                    className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2"
                    data-oid="vvsqx-i"
                  >
                    <span className="text-xs text-white" data-oid="z9nrtd9">
                      PM
                    </span>
                  </div>
                  <div
                    className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]"
                    data-oid="tya4d8h"
                  >
                    <p className="text-indigo-100" data-oid="jgb-qs6">
                      我们需要根据UI设计系统实现首页的三列布局
                    </p>
                  </div>
                </div>

                {/* 另一个代理消息 */}
                <div className="flex" data-oid="9p.n51t">
                  <div
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2"
                    data-oid="235ajv9"
                  >
                    <span className="text-xs text-white" data-oid="hw.9g5x">
                      AR
                    </span>
                  </div>
                  <div
                    className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]"
                    data-oid="-43-:.u"
                  >
                    <p className="text-indigo-100" data-oid="3ifi-pn">
                      建议使用Grid布局实现，确保响应式效果
                    </p>
                  </div>
                </div>

                {/* 用户消息 */}
                <div className="flex justify-end" data-oid="m7esr1q">
                  <div
                    className="bg-indigo-600/50 p-3 rounded-tl-lg rounded-tr-sm rounded-br-sm rounded-bl-lg max-w-[80%]"
                    data-oid="hsd8sdr"
                  >
                    <p className="text-white" data-oid="uhnrdq5">
                      好的，请提供具体的实现方案
                    </p>
                  </div>
                </div>
              </div>

              {/* 输入区域 */}
              <div
                className="mt-4 border-t border-indigo-800/20 pt-4"
                data-oid="c5.musi"
              >
                <div className="flex" data-oid="o0jqmdy">
                  <input
                    type="text"
                    className="flex-1 bg-indigo-900/20 text-indigo-100 p-3 rounded-l-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                    placeholder="输入消息..."
                    data-oid="twon-ej"
                  />

                  <button
                    className="bg-indigo-600 text-white px-4 rounded-r-md"
                    data-oid="y0fx525"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card" data-oid="_2bnsq3">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid=".l49qu."
              >
                上下文资料
              </h2>
              <div className="space-y-3" data-oid="vul:59y">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="0gvy.xw"
                >
                  <h3
                    className="text-indigo-100 text-sm font-medium"
                    data-oid="m.llp39"
                  >
                    首页设计稿
                  </h3>
                  <p className="text-indigo-300/70 text-xs" data-oid="s4:q6z.">
                    包含三列布局的设计规范
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="fr4gq9c"
                >
                  <h3
                    className="text-indigo-100 text-sm font-medium"
                    data-oid="tzu6atg"
                  >
                    组件库文档
                  </h3>
                  <p className="text-indigo-300/70 text-xs" data-oid="otkrz56">
                    shadcn/ui组件使用参考
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="v4v3_gg" />
      </div>
    </>
  );
}
