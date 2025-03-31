// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'
import StarBackground from '@/components/ui/StarBackground'
import Footer from '@/components/ui/footer'

/**
 * 首页组件
 * 
 * 系统入口首页，提供系统概览和快速入口
 *
 * @returns {React.ReactElement} 首页组件
 */
export default function HomePage() {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center space-y-12 mt-12">
            <h1 className="text-5xl font-bold tracking-tighter gradient-text">
              iT-Agent 智能代理协作系统
            </h1>
            
            <p className="text-xl text-indigo-200 max-w-3xl">
              基于AutoGen构建的多智能体协作系统，通过多个专业AI代理协同工作，高效解决复杂任务。
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-glow transition-all"
              >
                进入系统
              </Link>
              <Link
                href="/sessions"
                className="px-8 py-3 bg-purple-900/50 hover:bg-purple-800/60 text-white rounded-lg border border-purple-500/30 transition-all"
              >
                查看会话
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
              <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-6 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-indigo-900/60 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-100 mb-2">专业代理团队</h3>
                <p className="text-indigo-300">
                  团队包含多个专业AI代理，每个代理有特定专长，协同工作解决复杂问题。
                </p>
              </div>
              
              <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-6 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-indigo-900/60 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-100 mb-2">工具集成</h3>
                <p className="text-indigo-300">
                  系统集成丰富工具库，代理可访问和使用各种外部工具，扩展解决问题的能力。
                </p>
              </div>
              
              <div className="bg-indigo-950/40 border border-indigo-800/30 rounded-xl p-6 hover:shadow-glow transition-all">
                <div className="w-12 h-12 bg-indigo-900/60 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-100 mb-2">透明交流</h3>
                <p className="text-indigo-300">
                  代理之间以自然语言交流，团队协作过程透明可见，便于理解工作流程。
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}