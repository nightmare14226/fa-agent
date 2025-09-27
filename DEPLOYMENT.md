# pgvector with Prisma on Render - Deployment Guide

This project demonstrates how to use pgvector with Prisma in a Next.js application deployed on Render.

## Features

- ✅ PostgreSQL with pgvector extension
- ✅ Prisma ORM with vector support
- ✅ Vector similarity search using cosine distance
- ✅ RESTful API for embedding operations
- ✅ Demo UI for testing vector operations

## Prerequisites

- Node.js 18+ 
- PostgreSQL database with pgvector extension
- Render account

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   ```

3. **Set up the database with pgvector extension:**
   ```bash
   npm run db:setup
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Render Deployment

### Option 1: Using render.yaml (Recommended)

1. **Connect your repository to Render**
2. **Render will automatically detect the `render.yaml` file**
3. **The deployment will:**
   - Create a PostgreSQL database with pgvector extension
   - Build and deploy your Next.js application
   - Run database migrations automatically

### Option 2: Manual Setup

1. **Create a PostgreSQL database on Render:**
   - Go to Render Dashboard
   - Create a new PostgreSQL database
   - Note the connection string

2. **Create a Web Service:**
   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`
   - Add environment variable: `DATABASE_URL` with your database connection string

3. **Set up the database with pgvector extension:**
   ```bash
   npm run db:setup
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

## API Endpoints

### Create Embedding
```bash
POST /api/embeddings
Content-Type: application/json

{
  "userId": "user123",
  "source": "document",
  "content": "Your text content here",
  "metadata": {"type": "text"},
  "vector": [0.1, 0.2, ...] // 1536-dimensional vector
}
```

### Search Similar Embeddings
```bash
POST /api/embeddings/search
Content-Type: application/json

{
  "userId": "user123",
  "queryVector": [0.1, 0.2, ...], // 1536-dimensional vector
  "limit": 10,
  "threshold": 0.7
}
```

### Get User Embeddings
```bash
GET /api/embeddings?userId=user123&skip=0&take=20
```

## Vector Operations

The application includes utility functions for common vector operations:

- `searchSimilarEmbeddings()` - Find similar embeddings using cosine similarity
- `createEmbedding()` - Store new embeddings with vector data
- `getEmbeddingsByUser()` - Retrieve embeddings for a specific user
- `deleteEmbedding()` - Remove embeddings

## Database Schema

```prisma
model Embedding {
  id        String   @id @default(uuid())
  userId    String
  source    String
  content   String
  metadata  Json
  vector    Vector   // pgvector type with 1536 dimensions
  createdAt DateTime @default(now())
}

type Vector @pgVector(dim: 1536)
```

## Important Notes

1. **Vector Dimensions:** The schema is configured for 1536-dimensional vectors (OpenAI embedding size). Adjust the dimension in `schema.prisma` if using different embedding models.

2. **Database Extensions:** The pgvector extension is automatically enabled in the Prisma schema.

3. **Performance:** For production use, consider adding database indexes on frequently queried fields.

4. **Security:** Implement proper authentication and authorization for production use.

## Troubleshooting

- **Migration Issues:** Ensure your database has the pgvector extension enabled
- **Build Failures:** Check that all dependencies are properly installed
- **Connection Issues:** Verify your DATABASE_URL is correct and accessible

## Next Steps

- Add authentication and user management
- Implement real embedding generation (OpenAI, Cohere, etc.)
- Add more sophisticated vector search features
- Optimize database performance with proper indexing
