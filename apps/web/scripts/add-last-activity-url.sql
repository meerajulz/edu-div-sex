-- Add last_activity_url column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'last_activity_url'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN last_activity_url VARCHAR(255);
        
        RAISE NOTICE 'Added last_activity_url column to users table';
    ELSE
        RAISE NOTICE 'Column last_activity_url already exists in users table';
    END IF;
END $$;

-- Add index for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_last_activity_url 
ON users(last_activity_url) 
WHERE last_activity_url IS NOT NULL;