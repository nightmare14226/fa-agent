'use client'

import { useState } from 'react'

export default function VectorDemo() {
  const [userId, setUserId] = useState('')
  const [content, setContent] = useState('')
  const [source, setSource] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Mock vector generation (in real app, you'd use an embedding service)
  const generateMockVector = () => {
    return Array.from({ length: 1536 }, () => Math.random() * 2 - 1)
  }

  const handleCreateEmbedding = async () => {
    if (!userId || !content || !source) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const vector = generateMockVector()
      
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          source,
          content,
          metadata: { timestamp: new Date().toISOString() },
          vector,
        }),
      })

      if (response.ok) {
        alert('Embedding created successfully!')
        setContent('')
        setSource('')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating embedding:', error)
      alert('Error creating embedding')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!userId) {
      alert('Please enter a user ID')
      return
    }

    setLoading(true)
    try {
      const queryVector = generateMockVector()
      
      const response = await fetch('/api/embeddings/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          queryVector,
          limit: 5,
          threshold: 0.5,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error searching embeddings:', error)
      alert('Error searching embeddings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">pgvector Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Embedding */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Create Embedding</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Source (e.g., 'document', 'webpage')"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Content to embed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-20"
            />
            <button
              onClick={handleCreateEmbedding}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Embedding'}
            </button>
          </div>
        </div>

        {/* Search Embeddings */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Search Similar Embeddings</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Similar'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">Source: {result.source}</span>
                  <span className="text-sm text-gray-500">
                    Similarity: {(result.distance * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-sm text-gray-700">{result.content}</p>
                <div className="text-xs text-gray-500 mt-1">
                  ID: {result.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
