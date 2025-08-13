-- Fix production database timestamp issues
-- This will update all null timestamps to current time

-- Fix restaurants table timestamps
UPDATE restaurants 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

UPDATE restaurants 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL;

-- Ensure all restaurants have proper timestamps
UPDATE restaurants 
SET created_at = CURRENT_TIMESTAMP, 
    updated_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL OR updated_at IS NULL;

-- Verify the fix
SELECT COUNT(*) as restaurants_with_null_timestamps
FROM restaurants 
WHERE created_at IS NULL OR updated_at IS NULL;

-- Show sample data to confirm
SELECT id, name, created_at, updated_at 
FROM restaurants 
LIMIT 5;