// app/collaboration/history/page.tsx
import { Button } from "@/components/ui/Button";

export default function CollaborationHistoryPage() {
  return (
    <div className="container mx-auto py-8" data-oid="-ac._gl">
      <div
        className="flex justify-between items-center mb-6"
        data-oid="7jg849k"
      >
        <h1 className="text-2xl font-bold text-indigo-100" data-oid="2.k7e:s">
          协作历史
        </h1>
        <div className="flex space-x-3" data-oid="wtnh24u">
          <div className="relative" data-oid="1vj6:92">
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-indigo-900/20 text-indigo-100 rounded-md border border-indigo-800/30 focus:outline-none focus:border-indigo-500 w-64"
              placeholder="搜索会话..."
              data-oid="0fot8k6"
            />

            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-indigo-300/70"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              data-oid="z84:k_r"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid="nv6:5v7"
              />
            </svg>
          </div>
          <Button data-oid="5m56y3v">导出历史</Button>
        </div>
      </div>

      <div className="space-card" data-oid="j5zx1h8">
        <div className="overflow-x-auto" data-oid="3qnw4-5">
          <table className="w-full" data-oid="w5srr9x">
            <thead data-oid="i5g1ckx">
              <tr className="border-b border-indigo-800/30" data-oid="zebyqos">
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="15hn9ig"
                >
                  会话ID
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="84ha4k_"
                >
                  项目
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="te1.aud"
                >
                  参与代理
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="9lz_396"
                >
                  目标
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="v0a7zn:"
                >
                  开始时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="jx1320w"
                >
                  持续时间
                </th>
                <th
                  className="text-left p-4 text-indigo-100"
                  data-oid="nb55yr3"
                >
                  状态
                </th>
                <th
                  className="text-right p-4 text-indigo-100"
                  data-oid="iubjke8"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody data-oid="8or7-oe">
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="ege8m.k"
              >
                <td className="p-4 text-indigo-100" data-oid="q6u9w33">
                  #CS001
                </td>
                <td className="p-4 text-indigo-100" data-oid="w5t87ij">
                  智能代理系统
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="td4.dm1">
                  产品经理, 架构师, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="gvzir.0">
                  首页UI实现
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="ai_0g26">
                  2023-08-15 14:30
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="f_9l6ru">
                  45分钟
                </td>
                <td className="p-4" data-oid="io5jydy">
                  <span
                    className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full"
                    data-oid="aqwf5j9"
                  >
                    已完成
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="82cu.rr">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="5mlusk3"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="2435p4t">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="3:8pynf"
              >
                <td className="p-4 text-indigo-100" data-oid="w41l333">
                  #CS002
                </td>
                <td className="p-4 text-indigo-100" data-oid="x8sg2mg">
                  个人网站重构
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="_yyz3fb">
                  架构师, 开发者, 文档工程师
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="dfje-rc">
                  数据模型设计
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="iq2r2tb">
                  2023-08-20 10:15
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="43o9tbr">
                  1小时30分钟
                </td>
                <td className="p-4" data-oid="sgcfyfz">
                  <span
                    className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full"
                    data-oid="q1ybi9q"
                  >
                    进行中
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="r-y5tso">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="n_o8i7p"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="0b64iiu">
                    继续
                  </Button>
                </td>
              </tr>
              <tr
                className="border-b border-indigo-800/20 hover:bg-indigo-900/20"
                data-oid="xxkagzn"
              >
                <td className="p-4 text-indigo-100" data-oid="aclxj-c">
                  #CS003
                </td>
                <td className="p-4 text-indigo-100" data-oid="rg634b8">
                  数据可视化工具
                </td>
                <td className="p-4 text-indigo-300/70" data-oid=".lc-.ra">
                  产品经理, 开发者
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="i_eae.j">
                  API设计与规范
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="1a.1_xj">
                  2023-08-22 16:45
                </td>
                <td className="p-4 text-indigo-300/70" data-oid="y3y_djh">
                  55分钟
                </td>
                <td className="p-4" data-oid="hihg4hc">
                  <span
                    className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full"
                    data-oid="umgh0sz"
                  >
                    已暂停
                  </span>
                </td>
                <td className="p-4 text-right" data-oid="cnk13v:">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    data-oid="ia7w51m"
                  >
                    查看
                  </Button>
                  <Button size="sm" data-oid="pa1huy4">
                    继续
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="flex justify-between items-center mt-6"
          data-oid="-z:1l3t"
        >
          <div className="text-indigo-300/70" data-oid="lw1w0d9">
            显示 1-3 条，共 3 条记录
          </div>
          <div className="flex space-x-2" data-oid="ilp8d04">
            <Button variant="outline" size="sm" disabled data-oid="fcp:l:9">
              上一页
            </Button>
            <Button variant="outline" size="sm" disabled data-oid="lfxcmva">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
