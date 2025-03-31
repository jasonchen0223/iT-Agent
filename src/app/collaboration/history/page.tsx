// app/collaboration/history/page.tsx
import { Button } from '@/components/ui/button';

export default function CollaborationHistoryPage() {
  return (
    <div className="container mx-auto py-8" data-oid="krzobw-">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="gci3kpe"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid=":zhquwt">
          协作历史
        </h1>
        <div className="flex space-x-3" data-oid="kpg6lnu">
          <div className="relative" data-oid=".08ajpb">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索会话..."
              data-oid="he:t80:"
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="0k_1107"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid="hbup0ks"
              />
            </svg>
          </div>
          <Button data-oid="b:zqrxk">导出历史</Button>
        </div>
      </div>

      <div className="space-card" data-oid="pcll.ws">
        <div className="overflow-x-auto" data-oid=".14puwu">
          <table className="w-full" data-oid="v53m0.5">
            <thead data-oid="4g0uy-m">
              <tr className="border-b border-indigo-800/30" data-oid="sjb:-iv">
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="p1ygsyz"
                >
                  会话ID
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="kh1z2_1"
                >
                  项目
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="7or:hgy"
                >
                  参与代理
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="2a4k-cp"
                >
                  目标
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid=":0k26ak"
                >
                  开始时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="_-aajdf"
                >
                  持续时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="z8_9pkj"
                >
                  状态
                </th>
                <th
                  className="text-right p-4 text-indigo-100"
                  data-oid="fbw7jcy"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody data-oid="9sbb-o9">
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="b2h-9et"
              >
                <td className="p-4 text-indigo-100" data-oid="v2ch-ys">
                  #CS001
                </td>
                <td className="p-4 text-indigo-100" data-oid="-x83ql0">
                  智能代理系统
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="oveqxxz">
                  产品经理, 架构师, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="klsq4_-">
                  首页UI实现
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="adwxpv4">
                  2023-08-15 14:30
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="sbje-3i">
                  45分钟
                </td>
                <td className="p-4" data-oid="wna3xau">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="qcjjpca"
                  >
                    已完成
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="rkfknni">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="mj5:6:z"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="0sq.il2">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="hqor2ec"
              >
                <td className="p-4 text-indigo-100" data-oid="u87dyqn">
                  #CS002
                </td>
                <td className="p-4 text-indigo-100" data-oid="vouxcsk">
                  个人网站重构
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="-e.ts3g">
                  架构师, 开发者, 文档工程师
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="s8l:xts">
                  数据模型设计
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="x56fdzd">
                  2023-08-20 10:15
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="8s9.k-q">
                  1小时30分钟
                </td>
                <td className="p-4" data-oid="ir_a-1o">
                  <span
                    className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full"
                    data-oid="91xeb3d"
                  >
                    进行中
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="w9_-8br">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="0tysl83"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="9sxm0aj">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="-dcm0p1"
              >
                <td className="p-4 text-indigo-100" data-oid="w9nzyd7">
                  #CS003
                </td>
                <td className="p-4 text-indigo-100" data-oid=".72qegr">
                  数据可视化工具
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="ltsvjls">
                  产品经理, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="40-s96h">
                  API设计与规范
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="-d6omq4">
                  2023-08-22 16:45
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="skr579m">
                  55分钟
                </td>
                <td className="p-4" data-oid="9dbqx2.">
                  <span
                    className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
                    data-oid="w4s4d89"
                  >
                    已暂停
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="8w_w85o">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="wj2wsti"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="jhd1u_q">
                    继续
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="flex justify-between items-center mt-6"
          data-oid="drigq86"
        >
          <div className="text-indigo-300/70" data-oid="-de6.wg">
            显示 1-3 条，共 3 条记录
          </div>
          <div className="flex space-x-2" data-oid="9oc18tq">
            <Button variant="outline" size="sm" disabled data-oid="b-6buvf">
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled data-oid="5d-wnpm">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
