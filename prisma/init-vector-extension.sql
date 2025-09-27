-- Create the pgvector extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify the extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';
