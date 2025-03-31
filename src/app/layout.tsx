// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import ServerLayout from '@/components/layout/ServerLayout'

export const metadata: Metadata = {
  title: 'iT-Agent | 智能代理协作系统',
  description: '基于AutoGen构建的多智能代理协作系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ServerLayout>{children}</ServerLayout>
}