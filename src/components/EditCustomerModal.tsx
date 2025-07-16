"use client"

import { useState } from "react"
import { X, Building2, User, Phone, Mail, MapPin, Globe } from "lucide-react"

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customerData: any
  onSave: (updatedData: any) => void
}

export default function EditCustomerModal({
  isOpen,
  onClose,
  customerData,
  onSave,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: customerData?.name || "",
    address: customerData?.address || "",
    city: customerData?.city || "",
    state: customerData?.state || "",
    zip: customerData?.zip || "",
    contactName: customerData?.contactName || "",
    contactTitle: customerData?.contactTitle || "",
    phone: customerData?.phone || "",
    email: customerData?.email || "",
    website: customerData?.website || "",
    specialties: customerData?.specialties || [],
    status: customerData?.status || "active",
    plan: customerData?.plan || "Standard",
    notes: customerData?.notes || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const availableSpecialties = [
    "European",
    "Asian",
    "Domestic",
    "Hybrid",
    "Electric",
    "Diesel",
    "Performance",
    "Luxury",
    "Trucks",
    "Fleet Service",
    "Diagnostics",
    "Electrical",
    "Engine",
    "Transmission",
    "Brakes",
    "Suspension",
    "Air Conditioning",
    "Collision",
    "Body Work",
    "Painting",
    "Detailing",
  ]

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s: string) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Shop name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Customer Information
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Shop Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Building2 size={20} className="mr-2 text-[#019AFF]" />
                    Shop Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Shop Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                          errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                          errors.address ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                            errors.city ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                            errors.state ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                          errors.zip ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                      {errors.zip && (
                        <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <User size={20} className="mr-2 text-[#019AFF]" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                          errors.contactName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title/Position
                      </label>
                      <input
                        type="text"
                        value={formData.contactTitle}
                        onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                            errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] ${
                            errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Account Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Account Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subscription Plan
                      </label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF]"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Specialties
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                    {availableSpecialties.map((specialty) => (
                      <label key={specialty} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(specialty)}
                          onChange={() => handleSpecialtyToggle(specialty)}
                          className="rounded border-gray-300 text-[#019AFF] focus:ring-[#019AFF]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {specialty}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Notes
                  </h3>
                  
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes about this customer..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#019AFF] resize-none"
                  />
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}