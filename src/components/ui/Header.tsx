// components/ui/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-indigo-800/20 py-4" data-oid="w8.bxy:">
      <div
        className="container mx-auto flex justify-between items-center"
        data-oid="k7fn7:r"
      >
        <div className="flex items-center space-x-2" data-oid="jfuaptx">
          <h1 className="text-2xl font-bold text-indigo-100" data-oid="sg903t9">
            iT-Agent
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6" data-oid="qc5.nzf">
          <Link
            href="/"
            className="text-indigo-100 hover:text-white"
            data-oid="2tj_2q3"
          >
            首页
          </Link>
          <Link
            href="/projects"
            className="text-indigo-300/70 hover:text-white"
            data-oid="24x3x3k"
          >
            项目
          </Link>
          <Link
            href="/agents"
            className="text-indigo-300/70 hover:text-white"
            data-oid="3s3i.zq"
          >
            代理
          </Link>
          <Link
            href="/integrations"
            className="text-indigo-300/70 hover:text-white"
            data-oid="hlk0r3r"
          >
            工具集成
          </Link>
          <Link
            href="/settings"
            className="text-indigo-300/70 hover:text-white"
            data-oid="3lm.7sb"
          >
            设置
          </Link>
        </nav>
      </div>
    </header>
  );
}
