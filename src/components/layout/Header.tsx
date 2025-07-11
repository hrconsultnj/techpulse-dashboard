'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useAuth } from '@/hooks/useAuth'

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [signOut, router])

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Search query:', searchQuery)
    }
  }, [searchQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false)
  }, [])

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  const displayName = profile?.full_name || user?.email || 'User'
  const userInitials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <img
                src="/images/techpulse-logo-light.png"
                alt="TechPulse"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">TechPulse</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search vehicles, tickets, customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="feather:search" className="h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Role badge */}
            {profile?.role && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                profile.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                profile.role === 'supervisor' ? 'bg-blue-100 text-blue-800' :
                profile.role === 'technician' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            )}

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 px-2 py-1 transition-colors"
                aria-label="User menu"
                aria-expanded={isDropdownOpen}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {userInitials}
                </div>
                <span className="ml-2 text-gray-700 font-medium max-w-32 truncate">
                  {displayName}
                </span>
                <svg 
                  className={`ml-1 h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  {/* Overlay for mobile */}
                  <div 
                    className="fixed inset-0 z-40 lg:hidden" 
                    onClick={closeDropdown}
                    aria-hidden="true"
                  />
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      {profile?.company_name && (
                        <p className="text-xs text-gray-400 mt-1">{profile.company_name}</p>
                      )}
                    </div>

                    {/* Menu items */}
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={closeDropdown}
                    >
                      <Icon icon="feather:settings" className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="feather:log-out" className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header