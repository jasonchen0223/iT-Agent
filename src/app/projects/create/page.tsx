// app/projects/create/page.tsx
import { Button } from '@/components/ui/button';

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-8" data-oid="ov_ucdp">
      <h1
        className="text-2xl font-bold text-indigo-100 mb-6"
        data-oid="s5zduz5"
      >
        创建新项目
      </h1>

      <div className="space-card max-w-3xl mx-auto" data-oid="--cv_6k">
        <form className="space-y-6" data-oid="aaxj3_-">
          <div className="space-y-2" data-oid="4xe3-bp">
            <label className="text-indigo-100 block" data-oid="tcrvg:0">
              项目名称
            </label>
            <input
              type="text"
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
              placeholder="输入项目名称"
              data-oid="t:wnx89"
            />
          </div>

          <div className="space-y-2" data-oid="v5u.ntp">
            <label className="text-indigo-100 block" data-oid="4r65om:">
              项目描述
            </label>
            <textarea
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 min-h-[120px]"
              placeholder="简要描述项目目标和范围"
              data-oid="_p1-vkq"
            ></textarea>
          </div>

          <div className="space-y-2" data-oid="_iirjzh">
            <label className="text-indigo-100 block" data-oid="xqi09hu">
              项目类型
            </label>
            <div className="grid grid-cols-2 gap-4" data-oid="h9i4hwo">
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="rjx_e:l"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid="9gktp2w"
                >
                  软件开发
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="xm:f_4q">
                  前端、后端、移动应用等开发项目
                </p>
              </div>
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="rqj1et4"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid="s6im4g5"
                >
                  内容创作
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="wst5d7y">
                  文档、博客、视频等创作项目
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2" data-oid="tke.43m">
            <label className="text-indigo-100 block" data-oid="argui5o">
              参与代理
            </label>
            <div className="grid grid-cols-3 gap-2" data-oid="zjvthvh">
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="w3ge6pu"
              >
                <input
                  type="checkbox"
                  id="agent-pm"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="4ceg8mz"
                />

                <label
                  htmlFor="agent-pm"
                  className="text-indigo-100"
                  data-oid="jtbqz5i"
                >
                  产品经理
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="8o9i0yu"
              >
                <input
                  type="checkbox"
                  id="agent-ar"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="epkhqya"
                />

                <label
                  htmlFor="agent-ar"
                  className="text-indigo-100"
                  data-oid="a-mscv4"
                >
                  架构师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="v55xk0m"
              >
                <input
                  type="checkbox"
                  id="agent-dev"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="hm0-rgu"
                />

                <label
                  htmlFor="agent-dev"
                  className="text-indigo-100"
                  data-oid="4ofj4z8"
                >
                  开发者
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="yfdpaeh"
              >
                <input
                  type="checkbox"
                  id="agent-test"
                  className="rounded text-indigo-600"
                  data-oid="3g4t-4i"
                />

                <label
                  htmlFor="agent-test"
                  className="text-indigo-100"
                  data-oid="t7bc802"
                >
                  测试工程师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="w5wgace"
              >
                <input
                  type="checkbox"
                  id="agent-doc"
                  className="rounded text-indigo-600"
                  data-oid="eq69hmx"
                />

                <label
                  htmlFor="agent-doc"
                  className="text-indigo-100"
                  data-oid="9ww33.b"
                >
                  文档工程师
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4" data-oid="j1akzkz">
            <Button variant="outline" data-oid="wx3b66s">
              取消
            </Button>
            <Button data-oid="lzls4g6">创建项目</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
