// app/collaboration/history/page.tsx
import { Button } from "@/components/ui/Button";

export default function CollaborationHistoryPage() {
  return (
    <div className="container mx-auto py-8" data-oid="eb0-m--">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="8gblq6y"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="bjfcd1q">
          协作历史
        </h1>
        <div className="flex space-x-3" data-oid="azb:1ep">
          <div className="relative" data-oid="bhv400h">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索会话..."
              data-oid="8ojymob"
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="_rnnh83"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid="82n2bgu"
              />
            </svg>
          </div>
          <Button data-oid="86v_d:x">导出历史</Button>
        </div>
      </div>

      <div className="space-card" data-oid="3eeh8nv">
        <div className="overflow-x-auto" data-oid="x5a7z19">
          <table className="w-full" data-oid="6y9n1m9">
            <thead data-oid="3m.nwrs">
              <tr className="border-b border-indigo-800/30" data-oid="wg-uxrs">
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="1f-4jva"
                >
                  会话ID
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="easq:o9"
                >
                  项目
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="4r6q1my"
                >
                  参与代理
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="jwsmupy"
                >
                  目标
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="6.1wt3-"
                >
                  开始时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="dzdy7.6"
                >
                  持续时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="f6zkmit"
                >
                  状态
                </th>
                <th
                  className="text-right p-4 text-indigo-100"
                  data-oid="q3m5dlz"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody data-oid="927fuz0">
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="-fc.6.w"
              >
                <td className="p-4 text-indigo-100" data-oid="a3fdj:y">
                  #CS001
                </td>
                <td className="p-4 text-indigo-100" data-oid="w79n70t">
                  智能代理系统
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="sm4tvi9">
                  产品经理, 架构师, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="1i0chx_">
                  首页UI实现
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="k8cad99">
                  2023-08-15 14:30
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="hpzieet">
                  45分钟
                </td>
                <td className="p-4" data-oid="c:l29x2">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="q8of0zy"
                  >
                    已完成
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="uyxu4f:">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="b7vi00_"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="4vq_3uf">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="rpp0u21"
              >
                <td className="p-4 text-indigo-100" data-oid="qg7.hw.">
                  #CS002
                </td>
                <td className="p-4 text-indigo-100" data-oid="h41gmfz">
                  个人网站重构
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="zl.mgir">
                  架构师, 开发者, 文档工程师
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="q0so7wv">
                  数据模型设计
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="go1jl5f">
                  2023-08-20 10:15
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="-vcvbbj">
                  1小时30分钟
                </td>
                <td className="p-4" data-oid="63fwauo">
                  <span
                    className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full"
                    data-oid="4c_to_e"
                  >
                    进行中
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="e6jk8z8">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="cmf5hq4"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="z66:20_">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="zgib9tt"
              >
                <td className="p-4 text-indigo-100" data-oid="nm60a9t">
                  #CS003
                </td>
                <td className="p-4 text-indigo-100" data-oid="6i-:j5o">
                  数据可视化工具
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="tl8oe17">
                  产品经理, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="dvyd3d_">
                  API设计与规范
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="4awdbhc">
                  2023-08-22 16:45
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="rv4s.yy">
                  55分钟
                </td>
                <td className="p-4" data-oid="gova14c">
                  <span
                    className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
                    data-oid="24m_ah:"
                  >
                    已暂停
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="h8oo7j:">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="fvvf_9w"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="sn.8s.k">
                    继续
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="flex justify-between items-center mt-6"
          data-oid="jycez.2"
        >
          <div className="text-indigo-300/70" data-oid="-uccta.">
            显示 1-3 条，共 3 条记录
          </div>
          <div className="flex space-x-2" data-oid="813_iln">
            <Button variant="outline" size="sm" disabled data-oid="9996hj8">
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled data-oid="ef__7lx">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
