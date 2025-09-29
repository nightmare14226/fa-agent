'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hubspotStatus, setHubspotStatus] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Check for HubSpot connection status from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const hubspot = urlParams.get('hubspot')
    if (hubspot === 'connected') {
      setHubspotStatus('success')
    } else if (hubspot === 'error') {
      setHubspotStatus('error')
    }
  }, [])

  const handleHubSpotConnect = () => {
    window.location.href = '/api/auth/hubspot'
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Connection Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Google</h3>
                  <p className="text-sm text-gray-500">OAuth connection status</p>
                </div>
                <div className="flex items-center">
                  {session.user?.googleConnected ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      ✗ Not Connected
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* HubSpot Connection Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">HubSpot</h3>
                  <p className="text-sm text-gray-500">OAuth connection status</p>
                </div>
                <div className="flex items-center space-x-2">
                  {session.user?.hubspotConnected ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Connected
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✗ Not Connected
                      </span>
                      <button
                        onClick={handleHubSpotConnect}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Connect
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {hubspotStatus === 'success' && (
            <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              HubSpot connected successfully!
            </div>
          )}
          
          {hubspotStatus === 'error' && (
            <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Failed to connect HubSpot. Please try again.
            </div>
          )}

          {/* Vector Demo Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vector Operations</h2>
              <p className="text-sm text-gray-500 mb-4">
                Test the pgvector functionality with embeddings
              </p>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Go to Vector Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
