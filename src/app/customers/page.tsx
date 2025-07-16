"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Download,
  Edit,
  Trash2,
} from "lucide-react"

// Dropdown menu component
const DropdownMenu = ({ shopId }: { shopId: number }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation() // Prevent row click
          setIsOpen(!isOpen)
        }}
        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown menu */}
          <div className="absolute right-0 top-8 z-20 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
                // Handle edit action
                console.log("Edit customer", shopId)
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Edit size={14} className="mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
                // Handle delete action
                console.log("Delete customer", shopId)
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Trash2 size={14} className="mr-2" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// Mock data for automotive shops
const shops = [
  {
    id: 1,
    name: "Precision Auto Repair",
    logo: "/letter-p-typography.png",
    location: "Chicago, IL",
    contactName: "Robert Johnson",
    phone: "(312) 555-7890",
    email: "service@precisionauto.com",
    status: "active",
    plan: "Premium",
    activeTickets: 7,
    lastActive: "2 hours ago",
    specialties: ["European", "Diagnostics", "Electrical"],
  },
  {
    id: 2,
    name: "Metro Automotive Center",
    logo: "/letter-m-typography.png",
    location: "Dallas, TX",
    contactName: "Maria Rodriguez",
    phone: "(214) 555-3421",
    email: "service@metroauto.com",
    status: "active",
    plan: "Standard",
    activeTickets: 3,
    lastActive: "5 hours ago",
    specialties: ["Domestic", "Engine", "Transmission"],
  },
  {
    id: 3,
    name: "Elite Performance Garage",
    logo: "/letter-e-abstract.png",
    location: "Los Angeles, CA",
    contactName: "David Kim",
    phone: "(323) 555-9876",
    email: "info@elitegarage.com",
    status: "active",
    plan: "Premium",
    activeTickets: 12,
    lastActive: "Just now",
    specialties: ["Performance", "Custom", "Diagnostics"],
  },
  {
    id: 4,
    name: "Hometown Auto Service",
    logo: "/letter-h-typography.png",
    location: "Portland, OR",
    contactName: "Sarah Miller",
    phone: "(503) 555-1234",
    email: "service@hometownauto.com",
    status: "inactive",
    plan: "Basic",
    activeTickets: 0,
    lastActive: "2 days ago",
    specialties: ["Domestic", "General Repair"],
  },
  {
    id: 5,
    name: "Advanced Diagnostics & Repair",
    logo: "/letter-a-abstract.png",
    location: "Atlanta, GA",
    contactName: "James Wilson",
    phone: "(404) 555-5678",
    email: "service@advanceddiag.com",
    status: "active",
    plan: "Premium",
    activeTickets: 5,
    lastActive: "1 hour ago",
    specialties: ["Diagnostics", "European", "Asian"],
  },
  {
    id: 6,
    name: "Southside Truck & Auto",
    logo: "/abstract-letter-s.png",
    location: "Houston, TX",
    contactName: "Miguel Sanchez",
    phone: "(713) 555-4321",
    email: "info@southsideauto.com",
    status: "pending",
    plan: "Standard",
    activeTickets: 2,
    lastActive: "3 hours ago",
    specialties: ["Trucks", "Diesel", "Fleet Service"],
  },
  {
    id: 7,
    name: "Northtown Collision & Repair",
    logo: "/abstract-geometric-network.png",
    location: "Minneapolis, MN",
    contactName: "Lisa Anderson",
    phone: "(612) 555-8765",
    email: "service@northtowncollision.com",
    status: "active",
    plan: "Standard",
    activeTickets: 4,
    lastActive: "6 hours ago",
    specialties: ["Collision", "Body Work", "Painting"],
  },
  {
    id: 8,
    name: "Tech Masters Auto Service",
    logo: "/letter-t-typography.png",
    location: "Denver, CO",
    contactName: "Alex Thompson",
    phone: "(303) 555-2468",
    email: "service@techmasters.com",
    status: "active",
    plan: "Premium",
    activeTickets: 9,
    lastActive: "30 minutes ago",
    specialties: ["Hybrid", "Electric", "Advanced Diagnostics"],
  },
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      icon: <CheckCircle2 size={14} className="mr-1" />,
    },
    inactive: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: <XCircle size={14} className="mr-1" />,
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      icon: <Clock size={14} className="mr-1" />,
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function CustomersPage() {
  return (
    <div className="p-8">
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your automotive shop customers</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors">
            <Plus size={16} />
            <span>Add Customer</span>
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
          />
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">128</h3>
              </div>
              <div className="p-3 bg-[#019AFF]/10 rounded-full">
                <Users size={20} className="text-[#019AFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">112</h3>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle2 size={20} className="text-green-600 dark:text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Premium Subscribers</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">64</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Star size={20} className="text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Activation</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">7</h3>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Clock size={20} className="text-yellow-600 dark:text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers list */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {shops.map((shop) => (
                <tr
                  key={shop.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    // Navigate to customer details page
                    window.location.href = `/customers/${shop.id}`
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={shop.logo || "/placeholder.svg"}
                          alt={shop.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{shop.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {shop.specialties.join(" • ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} className="mr-1" />
                      {shop.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{shop.contactName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <Mail size={12} className="mr-1" />
                      {shop.email}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <Phone size={12} className="mr-1" />
                      {shop.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={shop.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        shop.plan === "Premium"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                          : shop.plan === "Standard"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {shop.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertCircle
                        size={14}
                        className={`mr-1 ${
                          shop.activeTickets > 5
                            ? "text-red-500"
                            : shop.activeTickets > 0
                              ? "text-yellow-500"
                              : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{shop.activeTickets}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {shop.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <DropdownMenu shopId={shop.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
            <span className="font-medium">128</span> customers
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm bg-[#019AFF] text-white hover:bg-[#0084D8]">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Missing import for Star icon
function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// Missing import for Users icon
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}