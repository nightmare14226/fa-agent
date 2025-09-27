const { PrismaClient } = require('@prisma/client')

async function startupCheck() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🚀 Starting application startup checks...')
    
    // Test database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check if pgvector extension exists
    console.log('🔍 Checking for pgvector extension...')
    const extensions = await prisma.$queryRaw`
      SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'
    `
    
    if (extensions.length > 0) {
      console.log('✅ pgvector extension found:', extensions[0].extversion)
    } else {
      console.log('⚠️  pgvector extension not found, creating it...')
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`
      console.log('✅ pgvector extension created')
    }
    
    // Test if tables exist
    console.log('🗃️  Checking database tables...')
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('User', 'Embedding', 'Task', 'Memory')
    `
    
    if (tables.length === 0) {
      console.log('⚠️  Database tables not found, running migrations...')
      const { execSync } = require('child_process')
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
      console.log('✅ Database migrations completed')
    } else {
      console.log('✅ Database tables found:', tables.map(t => t.table_name))
    }
    
    console.log('🎉 Startup checks completed successfully!')
    
  } catch (error) {
    console.error('❌ Startup check failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run startup checks
startupCheck()
