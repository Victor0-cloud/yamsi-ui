import React from 'react';

interface WelcomeProps {
  onSignIn: () => void;
}

export function Welcome({ onSignIn }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">Y</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">YAMSI</h1>
          <p className="text-gray-600 mb-8">
            Your AI Management System Interface
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Universal Business OS</p>
                <p className="text-sm text-gray-600">Manage any business type</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">AI-Powered Insights</p>
                <p className="text-sm text-gray-600">Instant calculations & memory</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Multi-Tenant Safe</p>
                <p className="text-sm text-gray-600">Your data stays private</p>
              </div>
            </div>
          </div>

          <button
            onClick={onSignIn}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Sign In
          </button>

          <p className="text-xs text-gray-500 mt-6">
            Secure authentication required
          </p>
        </div>
      </div>
    </div>
  );
}
