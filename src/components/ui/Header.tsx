// components/ui/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-indigo-800/20 py-4" data-oid="6w7lii7">
      <div
        className="container mx-auto flex justify-between items-center"
        data-oid="-cloxot"
      >
        <div className="flex items-center space-x-2" data-oid="3sd9i5g">
          <h1 className="text-2xl font-bold text-indigo-100" data-oid="xy8sq4u">
            iT-Agent
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6" data-oid="hzt0eoo">
          <Link
            href="/"
            className="text-indigo-100 hover:text-white"
            data-oid="kxwbj-z"
          >
            首页
          </Link>
          <Link
            href="/projects"
            className="text-indigo-300/70 hover:text-white"
            data-oid="_zhdtwx"
          >
            项目
          </Link>
          <Link
            href="/agents"
            className="text-indigo-300/70 hover:text-white"
            data-oid="8yow50."
          >
            代理
          </Link>
          <Link
            href="/integrations"
            className="text-indigo-300/70 hover:text-white"
            data-oid="jcw521x"
          >
            工具集成
          </Link>
          <Link
            href="/settings"
            className="text-indigo-300/70 hover:text-white"
            data-oid="6kfqrqm"
          >
            设置
          </Link>
        </nav>
      </div>
    </header>
  );
}
