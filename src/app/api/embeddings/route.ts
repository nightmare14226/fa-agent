import { NextRequest, NextResponse } from 'next/server'
import { createEmbedding, getEmbeddingsByUser } from '@/lib/vector-operations'

// GET /api/embeddings - Get embeddings for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const skip = parseInt(searchParams.get('skip') || '0')
    const take = parseInt(searchParams.get('take') || '20')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const embeddings = await getEmbeddingsByUser(userId, skip, take)
    return NextResponse.json({ embeddings })
  } catch (error) {
    console.error('Error fetching embeddings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/embeddings - Create a new embedding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, source, content, metadata, vector } = body

    if (!userId || !source || !content || !vector) {
      return NextResponse.json(
        { error: 'userId, source, content, and vector are required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(vector) || vector.length !== 1536) {
      return NextResponse.json(
        { error: 'vector must be an array of 1536 numbers' },
        { status: 400 }
      )
    }

    const embedding = await createEmbedding({
      userId,
      source,
      content,
      metadata: metadata || {},
      vector,
    })

    return NextResponse.json({ embedding }, { status: 201 })
  } catch (error) {
    console.error('Error creating embedding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
