'use client'

import type { Metadata } from 'next'
import { usePathname } from 'next/navigation'
import './globals.css'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'
import { ThemeProvider } from '@/components/theme-provider'

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
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }

  if (isChatPage) {
    // Chat page gets no layout (SynthChatInterface handles its own layout)
    return (
      <html lang="en">
        <body className="antialiased">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }

  // Regular pages get the full layout
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <Header />
            <main className="ml-64 p-6">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}