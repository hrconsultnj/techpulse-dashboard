"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Wrench,
  AlertTriangle,
  Info,
  Calendar,
  MapPin,
  Settings,
} from "lucide-react"

interface VehicleData {
  vin?: string
  year: string
  make: string
  model: string
  trim?: string
  engine?: string
  driveType?: string
}

interface VehicleInfoTabsProps {
  vehicle: VehicleData | null
}

export default function VehicleInfoTabs({ vehicle }: VehicleInfoTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: <Info size={16} /> },
    { id: "specs", label: "Specifications", icon: <Settings size={16} /> },
    { id: "maintenance", label: "Maintenance", icon: <Wrench size={16} /> },
    { id: "recalls", label: "Recalls", icon: <AlertTriangle size={16} /> },
    { id: "history", label: "Service History", icon: <Calendar size={16} /> },
    { id: "location", label: "Dealer Info", icon: <MapPin size={16} /> },
  ]

  // Mock data for different tabs
  const mockSpecs = {
    engine: "2.5L 4-Cylinder",
    transmission: "8-Speed Automatic",
    drivetrain: "Front-Wheel Drive",
    fuelType: "Gasoline",
    mpgCity: "28",
    mpgHighway: "39",
    weight: "3,310 lbs",
    length: "192.1 in",
    width: "72.4 in",
    height: "56.5 in",
    wheelbase: "111.2 in",
  }

  const mockMaintenanceItems = [
    { service: "Oil Change", nextDue: "5,000 miles", status: "upcoming" },
    { service: "Tire Rotation", nextDue: "3,500 miles", status: "upcoming" },
    { service: "Brake Inspection", nextDue: "15,000 miles", status: "ok" },
    { service: "Air Filter", nextDue: "12,000 miles", status: "ok" },
    { service: "Transmission Service", nextDue: "60,000 miles", status: "ok" },
  ]

  const mockRecalls = [
    {
      id: "NHTSA-2023-001",
      description: "Fuel Pump Issue",
      status: "Open",
      date: "March 15, 2023",
      remedy: "Replace fuel pump assembly",
    },
    {
      id: "NHTSA-2022-045",
      description: "Airbag Sensor Malfunction",
      status: "Completed",
      date: "August 22, 2022",
      remedy: "Software update applied",
    },
  ]

  const mockServiceHistory = [
    { date: "2023-11-15", service: "Oil Change", mileage: "45,280", shop: "Quick Lube Express" },
    { date: "2023-08-22", service: "Brake Pads Replacement", mileage: "42,150", shop: "Brake Masters" },
    { date: "2023-05-10", service: "Tire Rotation", mileage: "38,990", shop: "Tire Kingdom" },
    { date: "2023-02-18", service: "Oil Change", mileage: "35,420", shop: "Quick Lube Express" },
  ]

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Vehicle Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a vehicle above to view detailed information
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#019AFF] text-[#019AFF] dark:text-[#019AFF]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vehicle Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Year
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vehicle.year}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Make
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vehicle.make}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Model
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {vehicle.model}
                    </p>
                  </div>
                  {vehicle.vin && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        VIN
                      </label>
                      <p className="text-lg font-mono text-gray-900 dark:text-white">
                        {vehicle.vin}
                      </p>
                    </div>
                  )}
                  {vehicle.engine && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Engine
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {vehicle.engine}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(mockSpecs).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      </label>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMaintenanceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.service}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Due in {item.nextDue}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "upcoming"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "recalls" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Recalls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecalls.map((recall, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {recall.description}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ID: {recall.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Date: {recall.date}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Remedy: {recall.remedy}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            recall.status === "Open"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          }`}
                        >
                          {recall.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockServiceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {record.service}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {record.date} • {record.mileage} miles
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {record.shop}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Authorized Dealers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Toyota Downtown
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      123 Main Street, Chicago, IL 60601
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone: (312) 555-0123
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Distance: 2.3 miles
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Toyota North
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      456 North Ave, Chicago, IL 60614
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Phone: (312) 555-0456
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Distance: 5.7 miles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}