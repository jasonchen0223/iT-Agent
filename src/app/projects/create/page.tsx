// app/projects/create/page.tsx
import { Button } from "@/components/ui/Button";

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-indigo-100 mb-6">创建新项目</h1>

      <div className="space-card max-w-3xl mx-auto">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-indigo-100 block">项目名称</label>
            <input
              type="text"
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500"
              placeholder="输入项目名称"
            />
          </div>

          <div className="space-y-2">
            <label className="text-indigo-100 block">项目描述</label>
            <textarea
              className="w-full bg-indigo-900/20 text-indigo-100 p-3 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 min-h-[120px]"
              placeholder="简要描述项目目标和范围"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-indigo-100 block">项目类型</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500">
                <h3 className="text-indigo-100 font-medium mb-1">软件开发</h3>
                <p className="text-indigo-300/70 text-sm">
                  前端、后端、移动应用等开发项目
                </p>
              </div>
              <div className="p-4 bg-indigo-900/20 border border-indigo-800/30 rounded-md cursor-pointer hover:border-indigo-500">
                <h3 className="text-indigo-100 font-medium mb-1">内容创作</h3>
                <p className="text-indigo-300/70 text-sm">
                  文档、博客、视频等创作项目
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-indigo-100 block">参与代理</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md">
                <input
                  type="checkbox"
                  id="agent-pm"
                  defaultChecked
                  className="rounded text-indigo-600"
                />

                <label htmlFor="agent-pm" className="text-indigo-100">
                  产品经理
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md">
                <input
                  type="checkbox"
                  id="agent-ar"
                  defaultChecked
                  className="rounded text-indigo-600"
                />

                <label htmlFor="agent-ar" className="text-indigo-100">
                  架构师
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md">
                <input
                  type="checkbox"
                  id="agent-dev"
                  defaultChecked
                  className="rounded text-indigo-600"
                />

                <label htmlFor="agent-dev" className="text-indigo-100">
                  开发者
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md">
                <input
                  type="checkbox"
                  id="agent-test"
                  className="rounded text-indigo-600"
                />

                <label htmlFor="agent-test" className="text-indigo-100">
                  测试工程师
                </label>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-indigo-900/20 rounded-md">
                <input
                  type="checkbox"
                  id="agent-doc"
                  className="rounded text-indigo-600"
                />

                <label htmlFor="agent-doc" className="text-indigo-100">
                  文档工程师
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline">取消</Button>
            <Button>创建项目</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
