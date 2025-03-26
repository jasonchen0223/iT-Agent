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
      <StarBackground data-oid="h3syavh" />
      <div className="min-h-screen flex flex-col" data-oid="ytppfhb">
        {/* 会话信息栏 */}
        <div className="border-b border-indigo-800/20 py-4" data-oid="ft3rh43">
          <div className="container mx-auto" data-oid="6z66346">
            <h1
              className="text-2xl font-bold text-indigo-100"
              data-oid="y6am_j-"
            >
              前端开发协作会话
            </h1>
            <p className="text-indigo-300/70" data-oid="h0snbm_">
              目标: 实现首页UI组件 • 进行中
            </p>
          </div>
        </div>

        {/* 三列布局主体 */}
        <main className="flex-1 container mx-auto py-6" data-oid="18-blr1">
          <div
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
            data-oid="15tes5."
          >
            {/* 左侧参与代理列表 */}
            <div className="md:col-span-2 space-card" data-oid="9xjbp5g">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="__de0yw"
              >
                参与代理
              </h2>
              <div className="space-y-3" data-oid="qquzpce">
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="k0yxj52"
                >
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full mr-2"
                    data-oid="esgx7sq"
                  ></div>
                  <span className="text-indigo-100" data-oid="3x-4j40">
                    产品经理
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="m1mj53r"
                >
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full mr-2"
                    data-oid="hvuuppn"
                  ></div>
                  <span className="text-indigo-100" data-oid="3.hfhah">
                    架构师
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/30 rounded-md"
                  data-oid="tvs7rna"
                >
                  <div
                    className="w-3 h-3 bg-yellow-500 rounded-full mr-2"
                    data-oid="1..-gim"
                  ></div>
                  <span className="text-indigo-100" data-oid="74nj3:j">
                    前端开发
                  </span>
                </div>
                <div
                  className="flex items-center p-2 bg-indigo-900/20 rounded-md"
                  data-oid="xeu47m:"
                >
                  <div
                    className="w-3 h-3 bg-gray-500 rounded-full mr-2"
                    data-oid="hidtmek"
                  ></div>
                  <span className="text-indigo-300/70" data-oid="266.8a2">
                    测试工程师
                  </span>
                </div>
              </div>
            </div>

            {/* 中央消息流 */}
            <div className="md:col-span-7 space-card" data-oid="7dtbbby">
              <div
                className="space-y-4 max-h-[600px] overflow-y-auto"
                data-oid="e.k0xs_"
              >
                {/* 代理消息 */}
                <div className="flex" data-oid="gc4nbkn">
                  <div
                    className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center mr-2"
                    data-oid="_7wpw5y"
                  >
                    <span className="text-xs text-white" data-oid="_hix5v1">
                      PM
                    </span>
                  </div>
                  <div
                    className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]"
                    data-oid="lgraqpt"
                  >
                    <p className="text-indigo-100" data-oid=":1ig7:x">
                      我们需要根据UI设计系统实现首页的三列布局
                    </p>
                  </div>
                </div>

                {/* 另一个代理消息 */}
                <div className="flex" data-oid="u81gnq_">
                  <div
                    className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2"
                    data-oid="jde1laq"
                  >
                    <span className="text-xs text-white" data-oid="is:f7b7">
                      AR
                    </span>
                  </div>
                  <div
                    className="bg-indigo-900/30 p-3 rounded-tl-sm rounded-tr-lg rounded-br-lg rounded-bl-lg max-w-[80%]"
                    data-oid="ctvh46-"
                  >
                    <p className="text-indigo-100" data-oid="iegnsnq">
                      建议使用Grid布局实现，确保响应式效果
                    </p>
                  </div>
                </div>

                {/* 用户消息 */}
                <div className="flex justify-end" data-oid="2.j0dk0">
                  <div
                    className="bg-indigo-600/50 p-3 rounded-tl-lg rounded-tr-sm rounded-br-sm rounded-bl-lg max-w-[80%]"
                    data-oid="6t_.ce8"
                  >
                    <p className="text-white" data-oid="sdzisg_">
                      好的，请提供具体的实现方案
                    </p>
                  </div>
                </div>
              </div>

              {/* 输入区域 */}
              <div
                className="mt-4 border-t border-indigo-800/20 pt-4"
                data-oid=":m73cbh"
              >
                <div className="flex" data-oid="i1xq38x">
                  <input
                    type="text"
                    className="flex-1 bg-indigo-900/20 text-indigo-100 p-3 rounded-l-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
                    placeholder="输入消息..."
                    data-oid="2o-znta"
                  />

                  <button
                    className="bg-indigo-600 text-white px-4 rounded-r-md"
                    data-oid="hla5:rm"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            {/* 右侧上下文面板 */}
            <div className="md:col-span-3 space-card" data-oid="004c8d8">
              <h2
                className="text-lg font-semibold text-indigo-100 mb-3"
                data-oid="bx_ctrt"
              >
                上下文资料
              </h2>
              <div className="space-y-3" data-oid="9oak8fk">
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="-yebh.9"
                >
                  <h3
                    className="text-indigo-100 text-sm font-medium"
                    data-oid="xg_9h3-"
                  >
                    首页设计稿
                  </h3>
                  <p className="text-indigo-300/70 text-xs" data-oid="76rv4.y">
                    包含三列布局的设计规范
                  </p>
                </div>
                <div
                  className="p-3 bg-indigo-900/20 rounded-md"
                  data-oid="9jl0z6."
                >
                  <h3
                    className="text-indigo-100 text-sm font-medium"
                    data-oid="nobvlvm"
                  >
                    组件库文档
                  </h3>
                  <p className="text-indigo-300/70 text-xs" data-oid="kd68fga">
                    shadcn/ui组件使用参考
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer data-oid="yuprwn-" />
      </div>
    </>
  );
}
