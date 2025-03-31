// app/settings/layout.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";
import { Cog, KeyRound, FileText, Settings, User2, Sliders } from "lucide-react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon: ReactNode;
}

const NavLink = ({ href, children, icon }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center px-4 py-2.5 rounded-md gap-3 transition-colors
        ${isActive 
          ? 'bg-indigo-900/60 text-indigo-100 font-medium' 
          : 'text-indigo-300 hover:bg-indigo-900/30 hover:text-indigo-100'
        }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 侧边导航 */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-xl p-4">
                <h2 className="text-xl font-bold text-indigo-100 px-4 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  系统设置
                </h2>
                <nav className="space-y-1">
                  <NavLink href="/settings" icon={<Cog className="w-5 h-5" />}>
                    通用设置
                  </NavLink>
                  <NavLink href="/settings/api" icon={<KeyRound className="w-5 h-5" />}>
                    API 配置
                  </NavLink>
                  <NavLink href="/settings/preferences" icon={<Sliders className="w-5 h-5" />}>
                    用户偏好
                  </NavLink>
                  <NavLink href="/settings/logs" icon={<FileText className="w-5 h-5" />}>
                    系统日志
                  </NavLink>
                </nav>
              </div>
            </aside>
            
            {/* 内容区域 */}
            <div className="flex-1 bg-gradient-to-b from-indigo-950/40 to-black/40 border border-indigo-800/30 rounded-xl p-6">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
