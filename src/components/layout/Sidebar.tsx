'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

interface NavigationItem {
  name: string
  href: string
  icon: string
  category: 'Main' | 'Vehicle Information' | 'Management'
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: 'ic:round-dashboard', category: 'Main' },
    { name: 'Support Tickets', href: '/support-tickets', icon: 'famicons:ticket', category: 'Main' },
    { name: 'AI Chat', href: '/chat', icon: 'feather:message-square', category: 'Main' },
    { name: 'Team Chat', href: '/team-chat', icon: 'feather:message-circle', category: 'Main' },
    { name: 'VIN Decode', href: '/vin-decode', icon: 'mdi:car-info', category: 'Vehicle Information' },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: 'feather:book-open', category: 'Vehicle Information' },
    { name: 'Customers', href: '/customers', icon: 'feather:users', category: 'Management' },
    { name: 'Reports', href: '/reports', icon: 'feather:bar-chart-2', category: 'Management' },
    { name: 'My Profile', href: '/profile', icon: 'feather:user', category: 'Management' },
  ]

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-950 min-h-screen fixed left-0 top-0 z-50 transition-colors">
      <div className="p-4 border-b border-gray-700 dark:border-gray-800">
        <div className="flex justify-center mb-4">
          <Link href="/dashboard" className="flex items-center">
            <img
              src="/images/techpulse-logo-light.png"
              alt="TechPulse"
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-white">TechPulse</span>
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <nav className="space-y-6">
          {['Main', 'Vehicle Information', 'Management'].map((category) => {
            const categoryItems = navigation.filter(item => item.category === category)
            if (categoryItems.length === 0) return null
            
            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 dark:text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white dark:hover:text-white'
                        }`}
                      >
                        <Icon icon={item.icon} className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar