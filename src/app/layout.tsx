'use client'

import type { Metadata } from 'next'
import { usePathname } from 'next/navigation'
import './globals.css'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

// Auth pages that shouldn't have the layout
const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = AUTH_PAGES.includes(pathname)
  const isChatPage = pathname === '/chat'

  if (isAuthPage) {
    // Auth pages get no layout
    return (
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    )
  }

  if (isChatPage) {
    // Chat page gets no layout (SynthChatInterface handles its own layout)
    return (
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    )
  }

  // Regular pages get the full layout
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}