# Deploying to Render.com with PostgreSQL and pgvector

This guide will help you deploy your Next.js application with pgvector to Render.com.

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Render.com account
- ✅ PostgreSQL database created on Render

## Step 1: Create PostgreSQL Database on Render

1. **Go to Render Dashboard**
2. **Click "New +" → "PostgreSQL"**
3. **Configure your database:**
   - **Name**: `fa-agent-db` (or your preferred name)
   - **Database**: `fa_agent`
   - **User**: `fa_agent_user`
   - **Plan**: Choose based on your needs (Free tier available)
4. **Click "Create Database"**
5. **Note the connection details** (you'll need the `DATABASE_URL`)

## Step 2: Deploy Your Web Service

### Option A: Using render.yaml (Automatic)

1. **Push your code to GitHub** (make sure `render.yaml` is included)
2. **Go to Render Dashboard**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Render will automatically detect the `render.yaml` file**
6. **The deployment will:**
   - Install dependencies
   - Build your Next.js app
   - Connect to your PostgreSQL database
   - Set up environment variables

### Option B: Manual Configuration

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `fa-agent`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Choose based on your needs

5. **Add Environment Variables:**
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string from Step 1
   - **Key**: `NODE_ENV`
   - **Value**: `production`

## Step 3: Set Up pgvector Extension

After your service is deployed, you need to enable the pgvector extension:

### Method 1: Using Render Shell (Recommended)

1. **Go to your web service on Render Dashboard**
2. **Click on "Shell" tab**
3. **Run the setup command:**
   ```bash
   npm run db:render
   ```

### Method 2: Using Database Shell

1. **Go to your PostgreSQL database on Render Dashboard**
2. **Click on "Connect" → "External Connection"**
3. **Use the connection details with psql:**
   ```bash
   psql "postgresql://username:password@host:port/database"
   ```
4. **Run the SQL command:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

### Method 3: Using Prisma Studio

1. **Go to your web service on Render Dashboard**
2. **Click on "Shell" tab**
3. **Run:**
   ```bash
   npx prisma db execute --stdin
   ```
4. **Enter the SQL:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

## Step 4: Verify Deployment

1. **Check your service URL** (provided by Render)
2. **Test the vector operations:**
   - Create an embedding
   - Search for similar embeddings
   - Verify the demo interface works

## Environment Variables

Make sure these are set in your Render service:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **"Extension 'vector' does not exist"**
   - Solution: Run `CREATE EXTENSION IF NOT EXISTS vector;` in your database

2. **"Cannot connect to database"**
   - Check your `DATABASE_URL` environment variable
   - Ensure your database is running and accessible

3. **"Prisma client not generated"**
   - The build process should handle this automatically
   - If issues persist, add `prisma generate` to your build command

4. **"Migration failed"**
   - Ensure pgvector extension is created before running migrations
   - Check database permissions

### Debug Commands:

```bash
# Check if extension exists
npm run db:render

# View database logs
# Go to your database service → Logs tab

# Test database connection
npx prisma db pull
```

## Production Considerations

1. **Database Backups**: Enable automatic backups in Render
2. **Monitoring**: Set up health checks and monitoring
3. **Scaling**: Consider upgrading your database plan for production
4. **Security**: Use environment variables for sensitive data
5. **Performance**: Add database indexes for better query performance

## Support

- **Render Documentation**: https://render.com/docs
- **pgvector Documentation**: https://github.com/pgvector/pgvector
- **Prisma Documentation**: https://www.prisma.io/docs

## Next Steps

After successful deployment:

1. **Test all vector operations**
2. **Set up monitoring and alerts**
3. **Configure custom domain (if needed)**
4. **Set up CI/CD for automatic deployments**
5. **Add authentication and user management**
