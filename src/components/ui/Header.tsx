// components/ui/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-indigo-800/20 py-4" data-oid="l.5:evo">
      <div
        className="container mx-auto flex justify-between items-center"
        data-oid="tjoeiop"
      >
        <div className="flex items-center space-x-2" data-oid="6r745os">
          <h1 className="text-2xl font-bold text-indigo-100" data-oid="u_pfwlz">
            iT-Agent
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6" data-oid="urn9798">
          <Link
            href="/"
            className="text-indigo-100 hover:text-white"
            data-oid="f72f6h3"
          >
            首页
          </Link>
          <Link
            href="/projects"
            className="text-indigo-300/70 hover:text-white"
            data-oid="uf2kae1"
          >
            项目
          </Link>
          <Link
            href="/agents"
            className="text-indigo-300/70 hover:text-white"
            data-oid="6lex119"
          >
            代理
          </Link>
          <Link
            href="/integrations"
            className="text-indigo-300/70 hover:text-white"
            data-oid="i_gyvi9"
          >
            工具集成
          </Link>
          <Link
            href="/settings"
            className="text-indigo-300/70 hover:text-white"
            data-oid="f62k9b5"
          >
            设置
          </Link>
        </nav>
      </div>
    </header>
  );
}
