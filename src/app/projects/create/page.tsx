// app/projects/create/page.tsx
import { Button } from "@/components/ui/Button";

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-8" data-oid="ntlipnb">
      <h1
        className="text-2xl font-bold text-indigo-100 mb-6"
        data-oid="96e0yk5"
      >
        创建新项目
      </h1>

      <div className="space-card max-w-3xl mx-auto" data-oid="4izz.vk">
        <form className="space-y-6" data-oid="f05sn5f">
          <div className="space-y-2" data-oid="qa:_28a">
            <label className="text-indigo-100 block" data-oid="vomt9cs">
              项目名称
            </label>
            <input
              type="text"
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
              placeholder="输入项目名称"
              data-oid="82lno8j"
            />
          </div>

          <div className="space-y-2" data-oid="1fwasja">
            <label className="text-indigo-100 block" data-oid="y_w1p7z">
              项目描述
            </label>
            <textarea
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 min-h-[120px]"
              placeholder="简要描述项目目标和范围"
              data-oid="8-kd2p-"
            ></textarea>
          </div>

          <div className="space-y-2" data-oid="ik.albb">
            <label className="text-indigo-100 block" data-oid="lp2smh9">
              项目类型
            </label>
            <div className="grid grid-cols-2 gap-4" data-oid="s01ri0g">
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="e6.m:jb"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid="lz8ujuv"
                >
                  软件开发
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="928uwlg">
                  前端、后端、移动应用等开发项目
                </p>
              </div>
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="u5mg2ym"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid="u0e0pp3"
                >
                  内容创作
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="wd5:tcg">
                  文档、博客、视频等创作项目
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2" data-oid=":vplkwf">
            <label className="text-indigo-100 block" data-oid="76te.t0">
              参与代理
            </label>
            <div className="grid grid-cols-3 gap-2" data-oid="woain-o">
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="vehfa48"
              >
                <input
                  type="checkbox"
                  id="agent-pm"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="ap9c2od"
                />

                <label
                  htmlFor="agent-pm"
                  className="text-indigo-100"
                  data-oid="n1545s8"
                >
                  产品经理
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="d2mty43"
              >
                <input
                  type="checkbox"
                  id="agent-ar"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="ua9.pcf"
                />

                <label
                  htmlFor="agent-ar"
                  className="text-indigo-100"
                  data-oid="y6d.h_r"
                >
                  架构师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="rsw5fv4"
              >
                <input
                  type="checkbox"
                  id="agent-dev"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="_kazwxu"
                />

                <label
                  htmlFor="agent-dev"
                  className="text-indigo-100"
                  data-oid="69umcl0"
                >
                  开发者
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="w0e1cgr"
              >
                <input
                  type="checkbox"
                  id="agent-test"
                  className="rounded text-indigo-600"
                  data-oid="a0r9i:n"
                />

                <label
                  htmlFor="agent-test"
                  className="text-indigo-100"
                  data-oid="5zsws9t"
                >
                  测试工程师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="ad-x0jx"
              >
                <input
                  type="checkbox"
                  id="agent-doc"
                  className="rounded text-indigo-600"
                  data-oid="l2swsp2"
                />

                <label
                  htmlFor="agent-doc"
                  className="text-indigo-100"
                  data-oid="-4.4ufe"
                >
                  文档工程师
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4" data-oid="1hxgl_m">
            <Button variant="outline" data-oid="a651eyw">
              取消
            </Button>
            <Button data-oid="qsu:lzz">创建项目</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
