import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © 2024 TechPulse Dashboard. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer