// components/ui/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-indigo-800/20 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-indigo-100">iT-Agent</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-indigo-100 hover:text-white">
            首页
          </Link>
          <Link
            href="/projects"
            className="text-indigo-300/70 hover:text-white"
          >
            项目
          </Link>
          <Link href="/agents" className="text-indigo-300/70 hover:text-white">
            代理
          </Link>
          <Link
            href="/integrations"
            className="text-indigo-300/70 hover:text-white"
          >
            工具集成
          </Link>
          <Link
            href="/settings"
            className="text-indigo-300/70 hover:text-white"
          >
            设置
          </Link>
        </nav>
      </div>
    </header>
  );
}
