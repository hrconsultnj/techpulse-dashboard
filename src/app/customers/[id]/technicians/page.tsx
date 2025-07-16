"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MoreHorizontal,
  Search,
  Filter,
  Mail,
  Phone,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserPlus,
  Key,
  Edit,
  Trash2,
  User,
  BadgeCheck,
  LockKeyhole,
  X,
} from "lucide-react"

// Mock data for technicians
const technicians = [
  {
    id: 1,
    name: "Michael Rodriguez",
    email: "michael.r@precisionauto.com",
    phone: "(312) 555-1234",
    role: "Master Technician",
    status: "active",
    specialties: ["European", "Diagnostics", "Engine"],
    certifications: ["ASE Master", "BMW Certified"],
    lastLogin: "2 hours ago",
    avatar: "/technician-1.jpg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@precisionauto.com",
    phone: "(312) 555-2345",
    role: "Service Advisor",
    status: "active",
    specialties: ["Customer Service", "Scheduling"],
    certifications: ["Service Consultant Certified"],
    lastLogin: "1 day ago",
    avatar: "/technician-2.jpg",
  },
  {
    id: 3,
    name: "David Kim",
    email: "david.k@precisionauto.com",
    phone: "(312) 555-3456",
    role: "Technician",
    status: "active",
    specialties: ["Electrical", "Diagnostics"],
    certifications: ["ASE Electrical"],
    lastLogin: "3 hours ago",
    avatar: "/technician-3.jpg",
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa.c@precisionauto.com",
    phone: "(312) 555-4567",
    role: "Technician",
    status: "active",
    specialties: ["Transmission", "Drivetrain"],
    certifications: ["ASE Transmission"],
    lastLogin: "Just now",
    avatar: "/technician-4.jpg",
  },
  {
    id: 5,
    name: "James Wilson",
    email: "james.w@precisionauto.com",
    phone: "(312) 555-5678",
    role: "Shop Owner",
    status: "active",
    specialties: ["Management", "Diagnostics"],
    certifications: ["ASE Master", "Shop Management"],
    lastLogin: "5 hours ago",
    avatar: "/technician-5.jpg",
    isOwner: true,
  },
  {
    id: 6,
    name: "Robert Taylor",
    email: "robert.t@precisionauto.com",
    phone: "(312) 555-6789",
    role: "Technician",
    status: "inactive",
    specialties: ["Brakes", "Suspension"],
    certifications: ["ASE Brakes"],
    lastLogin: "2 weeks ago",
    avatar: "/technician-6.jpg",
  },
  {
    id: 7,
    name: "Emily Martinez",
    email: "emily.m@precisionauto.com",
    phone: "(312) 555-7890",
    role: "Service Writer",
    status: "pending",
    specialties: ["Customer Service", "Parts"],
    certifications: ["Parts Specialist"],
    lastLogin: "Never",
    avatar: "/technician-7.jpg",
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
      icon: <AlertTriangle size={14} className="mr-1" />,
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

// Dropdown menu component
const TechnicianActionMenu = ({ technicianId, isOwner = false }: { technicianId: number; isOwner?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
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
          <div className="absolute right-0 top-8 z-20 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
                // Handle edit action
                console.log("Edit technician", technicianId)
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Edit size={14} className="mr-2" />
              Edit Details
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
                // Handle reset password action
                console.log("Reset password for technician", technicianId)
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <Key size={14} className="mr-2" />
              Reset Password
            </button>

            {!isOwner && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  // Handle delete action
                  console.log("Delete technician", technicianId)
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Trash2 size={14} className="mr-2" />
                Delete Account
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function TechniciansPage({ params }: { params: { id: string } }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null)

  return (
    <div className="p-8">
      {/* Back button and header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Link
            href={`/customers/${params.id}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Customer Details
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technician Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage technicians for Precision Auto Repair</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#019AFF] hover:bg-[#0084D8] rounded-md text-sm font-medium text-white transition-colors"
          >
            <UserPlus size={16} />
            <span>Add Technician</span>
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search technicians..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
          />
        </div>

        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Technicians</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">7</h3>
              </div>
              <div className="p-3 bg-[#019AFF]/10 rounded-full">
                <User size={20} className="text-[#019AFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Technicians</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</h3>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Certified Technicians</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4</h3>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <BadgeCheck size={20} className="text-purple-600 dark:text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technicians list */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Specialties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {technicians.map((technician) => (
                <tr
                  key={technician.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedTechnician(technician)
                    setIsEditModalOpen(true)
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={technician.avatar || "/placeholder.svg?height=40&width=40&query=person"}
                          alt={technician.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{technician.name}</div>
                          {technician.isOwner && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              <Shield size={12} className="mr-1" />
                              Owner
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {technician.certifications.join(" • ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail size={12} className="mr-1" />
                      {technician.email}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                      <Phone size={12} className="mr-1" />
                      {technician.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{technician.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={technician.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {technician.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      {technician.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <TechnicianActionMenu technicianId={technician.id} isOwner={technician.isOwner} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Technician Modal */}
      {isAddModalOpen && <AddTechnicianModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />}

      {/* Edit Technician Modal */}
      {isEditModalOpen && selectedTechnician && (
        <EditTechnicianModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          technician={selectedTechnician}
        />
      )}
    </div>
  )
}

// Add Technician Modal Component
function AddTechnicianModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Technician",
    specialties: [] as string[],
    certifications: [] as string[],
  })

  const availableRoles = ["Technician", "Master Technician", "Service Advisor", "Service Writer", "Shop Manager"]

  const availableSpecialties = [
    "European",
    "Diagnostics",
    "Electrical",
    "Engine",
    "Transmission",
    "Brakes",
    "Suspension",
    "Customer Service",
    "Scheduling",
    "Parts",
  ]

  const availableCertifications = [
    "ASE Master",
    "ASE Electrical",
    "ASE Engine",
    "ASE Transmission",
    "ASE Brakes",
    "BMW Certified",
    "Service Consultant Certified",
    "Parts Specialist",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Adding technician:", formData)
    // Here you would typically make an API call to add the technician
    onClose()
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const handleCertificationToggle = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter((c) => c !== certification)
        : [...prev.certifications, certification],
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Technician</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <User size={20} className="mr-2 text-[#019AFF]" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                          placeholder="technician@shop.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        required
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <LockKeyhole size={20} className="mr-2 text-[#019AFF]" />
                    Account Setup
                  </h3>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      A welcome email will be sent to the technician with instructions to set up their password and
                      complete their account registration.
                    </p>
                    <div className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        id="send-welcome"
                        className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        defaultChecked
                      />
                      <label htmlFor="send-welcome" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Send welcome email
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Specialties</h3>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {availableSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Certifications</h3>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {availableCertifications.map((certification) => (
                      <label key={certification} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(certification)}
                          onChange={() => handleCertificationToggle(certification)}
                          className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{certification}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#019AFF] hover:bg-[#0084D8] rounded-md transition-colors"
              >
                Add Technician
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Edit Technician Modal Component
function EditTechnicianModal({
  isOpen,
  onClose,
  technician,
}: {
  isOpen: boolean
  onClose: () => void
  technician: any
}) {
  const [formData, setFormData] = useState({
    name: technician.name,
    email: technician.email,
    phone: technician.phone,
    role: technician.role,
    status: technician.status,
    specialties: technician.specialties,
    certifications: technician.certifications,
  })

  const availableRoles = ["Technician", "Master Technician", "Service Advisor", "Service Writer", "Shop Manager"]

  const availableSpecialties = [
    "European",
    "Diagnostics",
    "Electrical",
    "Engine",
    "Transmission",
    "Brakes",
    "Suspension",
    "Customer Service",
    "Scheduling",
    "Parts",
    "Management",
  ]

  const availableCertifications = [
    "ASE Master",
    "ASE Electrical",
    "ASE Engine",
    "ASE Transmission",
    "ASE Brakes",
    "BMW Certified",
    "Service Consultant Certified",
    "Parts Specialist",
    "Shop Management",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updating technician:", formData)
    // Here you would typically make an API call to update the technician
    onClose()
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s: string) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const handleCertificationToggle = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter((c: string) => c !== certification)
        : [...prev.certifications, certification],
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Technician</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <User size={20} className="mr-2 text-[#019AFF]" />
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        required
                        disabled={technician.isOwner}
                      >
                        {technician.isOwner ? (
                          <option value="Shop Owner">Shop Owner</option>
                        ) : (
                          availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                        required
                        disabled={technician.isOwner}
                      >
                        {technician.isOwner ? (
                          <option value="active">Active</option>
                        ) : (
                          <>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <LockKeyhole size={20} className="mr-2 text-[#019AFF]" />
                    Account Actions
                  </h3>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                      onClick={() => console.log("Reset password for", technician.id)}
                    >
                      <Key size={16} />
                      <span>Reset Password</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Specialties</h3>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {availableSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Certifications</h3>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {availableCertifications.map((certification) => (
                      <label key={certification} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(certification)}
                          onChange={() => handleCertificationToggle(certification)}
                          className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{certification}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {!technician.isOwner && (
                <button
                  type="button"
                  onClick={() => console.log("Delete technician", technician.id)}
                  className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Delete Technician
                </button>
              )}
              <div className="flex space-x-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#019AFF] hover:bg-[#0084D8] rounded-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}