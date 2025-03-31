import { cookies } from 'next/headers'
import { Toaster } from '@/components/ui/toaster'
import { ToastProvider } from '@/components/ui/toast-unified'
import ClientLayout from './ClientLayout'
import Script from 'next/script'

interface ServerLayoutProps {
  children: React.ReactNode;
}

export default function ServerLayout({ children }: ServerLayoutProps) {
  // 从cookies中获取侧边栏状态，默认为false (展开状态)
  const cookieStore = cookies();
  const sidebarCollapsed = cookieStore.get('sidebar-collapsed')?.value === 'true' || false;
  
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gradient-to-b from-indigo-950 to-black min-h-screen text-indigo-100">
        <ToastProvider>
          <ClientLayout sidebarCollapsed={sidebarCollapsed}>
            {children}
          </ClientLayout>
          <Toaster />
        </ToastProvider>
        
        {/* 添加初始化脚本避免AudioContext错误 */}
        <Script id="audio-context-fix" strategy="afterInteractive">
          {`
            // 延迟初始化AudioContext直到用户交互
            document.addEventListener('click', function initAudio() {
              if (window.AudioContext || window.webkitAudioContext) {
                // 仅在需要时创建
                document.removeEventListener('click', initAudio);
              }
            }, { once: true });
          `}
        </Script>
      </body>
    </html>
  )
} 