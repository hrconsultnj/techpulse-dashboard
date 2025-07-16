"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  MessageSquare,
  BarChart2,
  Edit,
  Building2,
  Users,
  CreditCard,
  User,
} from "lucide-react"
import EditCustomerModal from "@/components/EditCustomerModal"

// Mock data for a single automotive shop
const shopData = {
  id: 1,
  name: "Precision Auto Repair",
  logo: "/letter-p-typography.png",
  address: "1234 Mechanic Ave",
  city: "Chicago",
  state: "IL",
  zip: "60601",
  contactName: "Robert Johnson",
  contactTitle: "Service Manager",
  phone: "(312) 555-7890",
  email: "service@precisionauto.com",
  website: "www.precisionauto.com",
  status: "active",
  plan: "Premium",
  planRenewal: "Jan 15, 2026",
  activeTickets: 7,
  totalTickets: 143,
  lastActive: "2 hours ago",
  memberSince: "Mar 2022",
  specialties: ["European", "Diagnostics", "Electrical"],
  technicians: 8,
  notes: "Prefers phone contact for urgent matters. Specializes in European vehicles, particularly BMW and Mercedes.",
  recentTickets: [
    { id: "TK-7821", title: "BMW 328i - No Start Condition", status: "open", priority: "high", created: "2 hours ago" },
    {
      id: "TK-7819",
      title: "Mercedes E350 - ABS Light On",
      status: "open",
      priority: "medium",
      created: "5 hours ago",
    },
    { id: "TK-7814", title: "Audi A4 - Transmission Fault", status: "open", priority: "high", created: "1 day ago" },
    { id: "TK-7809", title: "VW Passat - Electrical Issue", status: "open", priority: "medium", created: "2 days ago" },
  ],
  paymentHistory: [
    { id: "INV-2023-11", date: "Nov 1, 2023", amount: "$249.99", status: "paid" },
    { id: "INV-2023-10", date: "Oct 1, 2023", amount: "$249.99", status: "paid" },
    { id: "INV-2023-09", date: "Sep 1, 2023", amount: "$249.99", status: "paid" },
  ],
}

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
    open: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      icon: <AlertCircle size={14} className="mr-1" />,
    },
    closed: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: <CheckCircle2 size={14} className="mr-1" />,
    },
    paid: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      icon: <CheckCircle2 size={14} className="mr-1" />,
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

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    high: {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    },
    medium: {
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    },
    low: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    },
  }

  const config = priorityConfig[priority as keyof typeof priorityConfig]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSaveCustomer = (updatedData: any) => {
    // Handle saving the updated customer data
    console.log("Saving customer data:", updatedData)
    // You would typically make an API call here
  }

  return (
    <div className="p-8">
      {/* Back button and header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{shopData.name}</h1>
          <div className="flex items-center mt-1">
            <StatusBadge status={shopData.status} />
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Member since {shopData.memberSince}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare size={16} />
            <span>Message</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors">
            <FileText size={16} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <Link
            href={`/customers/${params.id}`}
            className="py-4 px-1 border-b-2 border-[#019AFF] font-medium text-[#019AFF] dark:text-[#019AFF] text-sm"
            aria-current="page"
          >
            Overview
          </Link>
          <Link
            href={`/customers/${params.id}/technicians`}
            className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 text-sm"
          >
            Technicians
          </Link>
          <Link
            href={`/customers/${params.id}/tickets`}
            className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 text-sm"
          >
            Tickets
          </Link>
          <Link
            href={`/customers/${params.id}/billing`}
            className="py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 text-sm"
          >
            Billing
          </Link>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Customer info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                  <Image
                    src={shopData.logo || "/placeholder.svg"}
                    alt={shopData.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{shopData.name}</h3>
                <div className="mt-1 flex flex-wrap justify-center gap-2">
                  {shopData.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={18} className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{shopData.address}</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {shopData.city}, {shopData.state} {shopData.zip}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-white">{shopData.phone}</p>
                </div>

                <div className="flex items-center">
                  <Mail size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-white">{shopData.email}</p>
                </div>

                <div className="flex items-center">
                  <Building2 size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-white">{shopData.website}</p>
                </div>

                <div className="flex items-center">
                  <Users size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-gray-900 dark:text-white">{shopData.technicians} Technicians</p>
                    <Link
                      href={`/customers/${params.id}/technicians`}
                      className="text-xs text-[#019AFF] hover:text-[#0084D8]"
                    >
                      Manage
                    </Link>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-900 dark:text-white">Last active {shopData.lastActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      shopData.plan === "Premium"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                        : shopData.plan === "Standard"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {shopData.plan}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Renewal Date</span>
                  <span className="text-sm text-gray-900 dark:text-white">{shopData.planRenewal}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <StatusBadge status={shopData.status} />
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors">
                    <CreditCard size={16} />
                    <span>Manage Subscription</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {shopData.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.amount}</p>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <button className="text-sm text-[#019AFF] hover:text-[#0084D8] font-medium">
                    View All Transactions
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tickets and activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tickets</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{shopData.activeTickets}</h3>
                  </div>
                  <div className="p-3 bg-[#019AFF]/10 rounded-full">
                    <AlertCircle size={20} className="text-[#019AFF]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tickets</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{shopData.totalTickets}</h3>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <FileText size={20} className="text-gray-500 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Technicians</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{shopData.technicians}</h3>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <User size={20} className="text-green-600 dark:text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Tickets</CardTitle>
                <Link
                  href={`/customers/${params.id}/tickets`}
                  className="text-sm text-[#019AFF] hover:text-[#0084D8] font-medium"
                >
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {shopData.recentTickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">{ticket.id}</span>
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{ticket.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Created {ticket.created}</p>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={ticket.status} />
                      <button className="ml-4 text-[#019AFF] hover:text-[#0084D8]">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 dark:text-gray-300">{shopData.notes}</p>
              <div className="mt-4">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Edit size={16} />
                  <span>Edit Notes</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Support Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-gray-500 dark:text-gray-400">Support Activity Chart</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="inline-flex items-center gap-2 text-sm text-[#019AFF] hover:text-[#0084D8] font-medium">
                  <BarChart2 size={16} />
                  <span>View Detailed Reports</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customerData={shopData}
        onSave={handleSaveCustomer}
      />
    </div>
  )
}

// Missing import for XCircle icon
function XCircle(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  )
}

// Missing import for ArrowRight icon
function ArrowRight(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}