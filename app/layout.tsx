import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RoleProvider } from '../contexts/RoleContext'
import { NavigationProvider } from '../contexts/NavigationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '五育活动',
  description: '学校五育活动管理平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <RoleProvider>
          <NavigationProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </NavigationProvider>
        </RoleProvider>
      </body>
    </html>
  )
}
