'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import VectorDemo from "@/components/VectorDemo";

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">pgvector Demo</h1>
          <p className="text-lg text-gray-600 mb-6">
            Test vector similarity search with PostgreSQL and pgvector
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg"
          >
            Sign In to Continue
          </button>
        </div>
        <VectorDemo />
      </div>
    </div>
  );
}