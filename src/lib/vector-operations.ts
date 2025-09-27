import { prisma } from './prisma'

export interface VectorSearchResult {
  id: string
  content: string
  source: string
  metadata: any
  distance: number
}

/**
 * Search for similar embeddings using cosine similarity
 */
export async function searchSimilarEmbeddings(
  queryVector: number[],
  userId: string,
  limit: number = 10,
  threshold: number = 0.7
): Promise<VectorSearchResult[]> {
  const results = await prisma.$queryRaw<Array<{
    id: string
    content: string
    source: string
    metadata: any
    distance: number
  }>>`
    SELECT 
      id,
      content,
      source,
      metadata,
      1 - (vector <=> ${JSON.stringify(queryVector)}::vector) as distance
    FROM "Embedding"
    WHERE "userId" = ${userId}
      AND 1 - (vector <=> ${JSON.stringify(queryVector)}::vector) > ${threshold}
    ORDER BY vector <=> ${JSON.stringify(queryVector)}::vector
    LIMIT ${limit}
  `

  return results
}

/**
 * Create a new embedding with vector data
 */
export async function createEmbedding(data: {
  userId: string
  source: string
  content: string
  metadata: any
  vector: number[]
}) {
  return await prisma.embedding.create({
    data: {
      userId: data.userId,
      source: data.source,
      content: data.content,
      metadata: data.metadata,
      vector: data.vector,
    },
  })
}

/**
 * Get embeddings by user with pagination
 */
export async function getEmbeddingsByUser(
  userId: string,
  skip: number = 0,
  take: number = 20
) {
  return await prisma.embedding.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Delete an embedding by ID
 */
export async function deleteEmbedding(id: string, userId: string) {
  return await prisma.embedding.delete({
    where: { 
      id,
      userId, // Ensure user can only delete their own embeddings
    },
  })
}
