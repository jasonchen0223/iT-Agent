// app/projects/create/page.tsx
import { Button } from "@/components/ui/Button";

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-8" data-oid="zggg0e8">
      <h1
        className="text-2xl font-bold text-indigo-100 mb-6"
        data-oid="_03z84s"
      >
        创建新项目
      </h1>

      <div className="space-card max-w-3xl mx-auto" data-oid=":k0-2mb">
        <form className="space-y-6" data-oid="48h76f1">
          <div className="space-y-2" data-oid="te1739y">
            <label className="text-indigo-100 block" data-oid="6ib-r35">
              项目名称
            </label>
            <input
              type="text"
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
              placeholder="输入项目名称"
              data-oid="tuy9.z9"
            />
          </div>

          <div className="space-y-2" data-oid="4ynse-j">
            <label className="text-indigo-100 block" data-oid="in5x760">
              项目描述
            </label>
            <textarea
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 min-h-[120px]"
              placeholder="简要描述项目目标和范围"
              data-oid="lf:e3su"
            ></textarea>
          </div>

          <div className="space-y-2" data-oid="_av-vcz">
            <label className="text-indigo-100 block" data-oid="0v1_qa4">
              项目类型
            </label>
            <div className="grid grid-cols-2 gap-4" data-oid="7p14hc.">
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="qp8ktw5"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid=":go1y67"
                >
                  软件开发
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="nn-v.wx">
                  前端、后端、移动应用等开发项目
                </p>
              </div>
              <div
                className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500"
                data-oid="ju0-z7r"
              >
                <h3
                  className="text-indigo-100 font-medium mb-1"
                  data-oid="5-mih.6"
                >
                  内容创作
                </h3>
                <p className="text-indigo-300/70 text-sm" data-oid="i:t-dh2">
                  文档、博客、视频等创作项目
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2" data-oid="0la-ozv">
            <label className="text-indigo-100 block" data-oid="f84qaj7">
              参与代理
            </label>
            <div className="grid grid-cols-3 gap-2" data-oid="ugfjh-q">
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="skphg3c"
              >
                <input
                  type="checkbox"
                  id="agent-pm"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="bz9t6oa"
                />

                <label
                  htmlFor="agent-pm"
                  className="text-indigo-100"
                  data-oid="i:vgase"
                >
                  产品经理
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="8i..x6v"
              >
                <input
                  type="checkbox"
                  id="agent-ar"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="mbyuqdq"
                />

                <label
                  htmlFor="agent-ar"
                  className="text-indigo-100"
                  data-oid="fktpd_z"
                >
                  架构师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="n-t3x6."
              >
                <input
                  type="checkbox"
                  id="agent-dev"
                  defaultChecked
                  className="rounded text-indigo-600"
                  data-oid="0w:0jd2"
                />

                <label
                  htmlFor="agent-dev"
                  className="text-indigo-100"
                  data-oid="yi9v4:_"
                >
                  开发者
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="rtdt:8n"
              >
                <input
                  type="checkbox"
                  id="agent-test"
                  className="rounded text-indigo-600"
                  data-oid="bwmr:24"
                />

                <label
                  htmlFor="agent-test"
                  className="text-indigo-100"
                  data-oid="8oqn-12"
                >
                  测试工程师
                </label>
              </div>
              <div
                className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md"
                data-oid="q1anryl"
              >
                <input
                  type="checkbox"
                  id="agent-doc"
                  className="rounded text-indigo-600"
                  data-oid="34qq8s."
                />

                <label
                  htmlFor="agent-doc"
                  className="text-indigo-100"
                  data-oid=":nhwyuy"
                >
                  文档工程师
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4" data-oid=":asslsh">
            <Button variant="outline" data-oid="g8xspcx">
              取消
            </Button>
            <Button data-oid="shjyj1v">创建项目</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
