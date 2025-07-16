"use client"

import { useState } from "react"
import { Scan } from "lucide-react"
import VehicleInfoTabs from "@/components/VehicleInfoTabs"

interface VehicleData {
  vin?: string
  year: string
  make: string
  model: string
  trim?: string
  engine?: string
  driveType?: string
}

export default function VinDecodePage() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null)
  const [vinInput, setVinInput] = useState("")
  const [licenseInput, setLicenseInput] = useState("")
  const [vehicleForm, setVehicleForm] = useState({
    year: "",
    make: "",
    model: "",
    engine: "",
  })

  // Mock data
  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString())
  const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia"]
  const models = {
    Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Prius", "Tacoma"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Ridgeline"],
    Ford: ["F-150", "Mustang", "Explorer", "Escape", "Focus", "Edge"],
  }
  const engines = ["2.0L I4", "2.5L I4", "3.5L V6", "5.0L V8", "1.5L Turbo", "2.0L Turbo"]

  const handleVinLookup = () => {
    if (vinInput.length === 17) {
      const mockVehicle: VehicleData = {
        vin: vinInput,
        year: "2022",
        make: "Toyota",
        model: "Camry",
        engine: "2.5L I4",
      }
      setSelectedVehicle(mockVehicle)
    }
  }

  const handleLicenseLookup = () => {
    if (licenseInput.length >= 3) {
      const mockVehicle: VehicleData = {
        year: "2021",
        make: "Honda",
        model: "Civic",
        engine: "2.0L I4",
      }
      setSelectedVehicle(mockVehicle)
    }
  }

  const handleManualLookup = () => {
    if (vehicleForm.year && vehicleForm.make && vehicleForm.model) {
      setSelectedVehicle(vehicleForm as VehicleData)
    }
  }

  const clearVehicle = () => {
    setSelectedVehicle(null)
    setVinInput("")
    setLicenseInput("")
    setVehicleForm({ year: "", make: "", model: "", engine: "" })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Modern Vehicle Lookup */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Top Row - License, VIN, Scan */}
        <div className="flex items-center gap-4 mb-6">
          {/* License Plate */}
          <div className="flex items-center">
            <input
              type="text"
              value={licenseInput}
              onChange={(e) => setLicenseInput(e.target.value.toUpperCase())}
              placeholder="License Plate"
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white w-48"
            />
            <button
              onClick={handleLicenseLookup}
              disabled={licenseInput.length < 3}
              className="px-6 py-3 bg-[#019AFF] text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              License
            </button>
          </div>

          {/* VIN Input */}
          <div className="flex items-center">
            <input
              type="text"
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value.toUpperCase())}
              placeholder="Enter VIN"
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white w-64 font-mono"
              maxLength={17}
            />
            <button
              onClick={handleVinLookup}
              disabled={vinInput.length !== 17}
              className="px-6 py-3 bg-[#019AFF] text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Enter VIN
            </button>
          </div>

          {/* Scan VIN */}
          <button
            onClick={() => {
              // Mock scan result
              setVinInput("1HGBH41JXMN109186")
              setTimeout(handleVinLookup, 100)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-[#019AFF] text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            <Scan size={20} />
            Scan VIN
          </button>
        </div>

        {/* Bottom Row - Manual Selection */}
        <div className="flex items-center gap-4">
          <select
            value={vehicleForm.year}
            onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={vehicleForm.make}
            onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value, model: "" })}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          <select
            value={vehicleForm.model}
            onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
            disabled={!vehicleForm.make}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[140px] disabled:opacity-50"
          >
            <option value="">Select Model</option>
            {vehicleForm.make &&
              models[vehicleForm.make as keyof typeof models]?.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
          </select>

          <select
            value={vehicleForm.engine}
            onChange={(e) => {
              setVehicleForm({ ...vehicleForm, engine: e.target.value })
              // Auto-trigger lookup when engine is selected and we have year/make/model
              if (vehicleForm.year && vehicleForm.make && vehicleForm.model && e.target.value) {
                setTimeout(() => {
                  setSelectedVehicle({
                    year: vehicleForm.year,
                    make: vehicleForm.make,
                    model: vehicleForm.model,
                    engine: e.target.value,
                  })
                }, 100)
              }
            }}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#019AFF] text-gray-900 dark:text-white appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">Select Engine</option>
            {engines.map((engine) => (
              <option key={engine} value={engine}>
                {engine}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Vehicle Display */}
        {selectedVehicle && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                {selectedVehicle.engine && (
                  <span className="ml-4 text-sm font-normal text-gray-600 dark:text-gray-400">
                    {selectedVehicle.engine}
                  </span>
                )}
                {selectedVehicle.vin && (
                  <span className="ml-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                    VIN: {selectedVehicle.vin}
                  </span>
                )}
              </div>
              <button
                onClick={clearVehicle}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Vehicle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Information Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 h-[calc(100vh-320px)]">
        <VehicleInfoTabs vehicle={selectedVehicle} />
      </div>
    </div>
  )
}