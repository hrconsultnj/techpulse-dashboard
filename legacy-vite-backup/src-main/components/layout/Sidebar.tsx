import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiHome, FiSettings, FiUsers, FiBarChart, FiLayout, FiMessageSquare } from 'react-icons/fi'
import type { IconType } from 'react-icons'

interface NavigationItem {
  name: string
  href: string
  icon: IconType
}

const Sidebar: React.FC = () => {
  const location = useLocation()

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'AI Chat', href: '/chat', icon: FiMessageSquare },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart },
    { name: 'Users', href: '/users', icon: FiUsers },
    { name: 'Page Builder', href: '/page-builder', icon: FiLayout },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ]

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const IconComponent = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <IconComponent className="mr-3 h-5 w-5" />
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