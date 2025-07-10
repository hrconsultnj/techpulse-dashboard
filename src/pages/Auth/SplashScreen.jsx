import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const SplashScreen = () => {
  const features = [
    'Modern dashboard interface',
    'Real-time analytics',
    'User management',
    'Customizable widgets',
    'Secure authentication',
    'Responsive design',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-8">
            <span className="text-white font-bold text-2xl">TP</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">TechPulse</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            The modern dashboard template that helps you build amazing applications faster than ever before.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Everything you need to get started
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0">
                      <FiCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3 text-lg text-gray-700">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-8">
                Create your account and start building your dashboard in minutes.
              </p>
              <div className="space-y-4">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FiArrowRight className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Fast Setup</h3>
              <p className="mt-2 text-base text-gray-500">
                Get your dashboard up and running in under 5 minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FiCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Reliable</h3>
              <p className="mt-2 text-base text-gray-500">
                Built with modern technologies and best practices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FiArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Customizable</h3>
              <p className="mt-2 text-base text-gray-500">
                Fully customizable to match your brand and requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;