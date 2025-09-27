const { PrismaClient } = require('@prisma/client')

async function setupRenderDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🚀 Setting up database for Render deployment...')
    
    // Check if we can connect to the database
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create the pgvector extension
    console.log('📦 Creating pgvector extension...')
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`
    console.log('✅ pgvector extension created successfully')
    
    // Verify the extension is installed
    const extensions = await prisma.$queryRaw`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `
    
    if (extensions.length > 0) {
      console.log('✅ pgvector extension verified')
      console.log('📋 Extension details:', {
        name: extensions[0].extname,
        version: extensions[0].extversion,
        schema: extensions[0].extnamespace
      })
    } else {
      throw new Error('pgvector extension not found after creation')
    }
    
    // Run migrations
    console.log('🔄 Running database migrations...')
    const { execSync } = require('child_process')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Database migrations completed')
    
    console.log('🎉 Render database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Error setting up Render database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupRenderDatabase()
    .then(() => {
      console.log('✅ Render deployment setup completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Render deployment setup failed:', error)
      process.exit(1)
    })
}

module.exports = { setupRenderDatabase }
