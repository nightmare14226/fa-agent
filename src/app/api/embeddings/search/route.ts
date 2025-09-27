import { NextRequest, NextResponse } from 'next/server'
import { searchSimilarEmbeddings } from '@/lib/vector-operations'

// POST /api/embeddings/search - Search for similar embeddings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, queryVector, limit = 10, threshold = 0.7 } = body

    if (!userId || !queryVector) {
      return NextResponse.json(
        { error: 'userId and queryVector are required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(queryVector) || queryVector.length !== 1536) {
      return NextResponse.json(
        { error: 'queryVector must be an array of 1536 numbers' },
        { status: 400 }
      )
    }

    const results = await searchSimilarEmbeddings(
      queryVector,
      userId,
      limit,
      threshold
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error searching embeddings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
