const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Setting up database with pgvector extension...')
    
    // Create the pgvector extension
    await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`
    console.log('✅ pgvector extension created successfully')
    
    // Verify the extension is installed
    const extensions = await prisma.$queryRaw`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `
    
    if (extensions.length > 0) {
      console.log('✅ pgvector extension verified')
      console.log('Extension details:', extensions[0])
    } else {
      console.log('❌ pgvector extension not found')
    }
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Database setup failed:', error)
      process.exit(1)
    })
}

module.exports = { setupDatabase }
