'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      setHealthStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="space-y-4">
        <button
          onClick={checkHealth}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Health'}
        </button>

        {healthStatus && (
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Health Status</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold">Common Issues:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Database connection string incorrect</li>
            <li>pgvector extension not installed</li>
            <li>Database migrations not run</li>
            <li>Environment variables not set</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
