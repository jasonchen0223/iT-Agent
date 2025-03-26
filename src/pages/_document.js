import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#07061B" />
        <link
          rel="preload"
          href="/fonts/inter-var-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="bg-space-darker text-foreground min-h-screen antialiased">
        <Main />
        <NextScript />
        {/* 添加初始化脚本避免AudioContext错误 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 延迟初始化AudioContext直到用户交互
              document.addEventListener('click', function initAudio() {
                if (window.AudioContext || window.webkitAudioContext) {
                  // 仅在需要时创建
                  document.removeEventListener('click', initAudio);
                }
              }, { once: true });
            `,
          }}
        />
      </body>
    </Html>
  )
} 