'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

interface NavigationItem {
  name: string
  href: string
  icon: string
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: 'material-symbols:dashboard' },
    { name: 'AI Chat', href: '/chat', icon: 'feather:message-square' },
    { name: 'Analytics', href: '/analytics', icon: 'streamline-freehand:analytics-graph-line-triple' },
    { name: 'Users', href: '/users', icon: 'feather:users' },
    { name: 'Page Builder', href: '/page-builder', icon: 'feather:layout' },
    { name: 'Settings', href: '/settings', icon: 'feather:settings' },
  ]

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon icon={item.icon} className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar