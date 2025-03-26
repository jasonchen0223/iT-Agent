// app/collaboration/history/page.tsx
import { Button } from "@/components/ui/Button";

export default function CollaborationHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-100">协作历史</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索会话..."
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Button>导出历史</Button>
        </div>
      </div>

      <div className="space-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-800/30">
                <th className="text-left p-4 text-indigo-100">会话ID</th>
                <th className="text-left p-4 text-indigo-100">项目</th>
                <th className="text-left p-4 text-indigo-100">参与代理</th>
                <th className="text-left p-4 text-indigo-100">目标</th>
                <th className="text-left p-4 text-indigo-100">开始时间</th>
                <th className="text-left p-4 text-indigo-100">持续时间</th>
                <th className="text-left p-4 text-indigo-100">状态</th>
                <th className="text-right p-4 text-indigo-100">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-indigo-800/20 hover:bg-indigo-900/20">
                <td className="p-4 text-indigo-100">#CS001</td>
                <td className="p-4 text-indigo-100">智能代理系统</td>
                <td className="p-4 text-indigo-300/70">
                  产品经理, 架构师, 开发者
                </td>
                <td className="p-4 text-indigo-300/70">首页UI实现</td>
                <td className="p-4 text-indigo-300/70">2023-08-15 14:30</td>
                <td className="p-4 text-indigo-300/70">45分钟</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    已完成
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    查看
                  </Button>
                  <Button size="sm">继续</Button>
                </td>
              </tr>
              <tr className="border-b border-indigo-800/20 hover:bg-indigo-900/20">
                <td className="p-4 text-indigo-100">#CS002</td>
                <td className="p-4 text-indigo-100">个人网站重构</td>
                <td className="p-4 text-indigo-300/70">
                  架构师, 开发者, 文档工程师
                </td>
                <td className="p-4 text-indigo-300/70">数据模型设计</td>
                <td className="p-4 text-indigo-300/70">2023-08-20 10:15</td>
                <td className="p-4 text-indigo-300/70">1小时30分钟</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                    进行中
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    查看
                  </Button>
                  <Button size="sm">继续</Button>
                </td>
              </tr>
              <tr className="border-b border-indigo-800/20 hover:bg-indigo-900/20">
                <td className="p-4 text-indigo-100">#CS003</td>
                <td className="p-4 text-indigo-100">数据可视化工具</td>
                <td className="p-4 text-indigo-300/70">产品经理, 开发者</td>
                <td className="p-4 text-indigo-300/70">API设计与规范</td>
                <td className="p-4 text-indigo-300/70">2023-08-22 16:45</td>
                <td className="p-4 text-indigo-300/70">55分钟</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    已暂停
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="outline" size="sm" className="mr-2">
                    查看
                  </Button>
                  <Button size="sm">继续</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-indigo-300/70">显示 1-3 条，共 3 条记录</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled>
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
