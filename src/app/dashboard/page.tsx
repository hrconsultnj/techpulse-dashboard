'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import { useAuth } from '@/hooks/useAuth'

interface DashboardStat {
  name: string
  value: string
  change: string
  changeType: 'positive' | 'negative'
  icon: string
}

interface ActivityItem {
  id: number
  action: string
  time: string
  details: string
}

export default function Dashboard() {
  const { user } = useAuth()

  const stats: DashboardStat[] = [
    {
      name: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: 'feather:users',
    },
    {
      name: 'Revenue',
      value: '$45,231',
      change: '+8%',
      changeType: 'positive',
      icon: 'feather:dollar-sign',
    },
    {
      name: 'Active Sessions',
      value: '1,234',
      change: '-2%',
      changeType: 'negative',
      icon: 'feather:activity',
    },
    {
      name: 'Growth Rate',
      value: '24.5%',
      change: '+5%',
      changeType: 'positive',
      icon: 'feather:trending-up',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back, {user?.email || 'User'}! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon icon={stat.icon} className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Latest updates from your dashboard
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {([
            {
              id: 1,
              action: 'New user registered',
              time: '2 hours ago',
              details: 'john.doe@example.com',
            },
            {
              id: 2,
              action: 'Payment processed',
              time: '4 hours ago',
              details: '$299.00',
            },
            {
              id: 3,
              action: 'System backup completed',
              time: '6 hours ago',
              details: 'All data backed up successfully',
            },
          ] as ActivityItem[]).map((activity) => (
            <li key={activity.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <Icon icon="feather:activity" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.details}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {activity.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}