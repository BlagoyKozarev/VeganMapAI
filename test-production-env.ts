// Test script to simulate production environment
import dotenv from 'dotenv';
dotenv.config();

// Force production environment
process.env.NODE_ENV = 'production';

console.log('=== PRODUCTION ENVIRONMENT TEST ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/npg_[^@]*/, 'npg_HIDDEN'));

// Now test the production database fix
import { getProductionDatabaseUrl } from './server/production-db-fix';
const fixedUrl = getProductionDatabaseUrl();
console.log('Fixed URL:', fixedUrl.replace(/npg_[^@]*/, 'npg_HIDDEN'));

// Test database connection with fixed URL
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: fixedUrl });

async function testConnection() {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM restaurants');
        console.log('✅ Database connection successful!');
        console.log('Restaurant count:', result.rows[0].count);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    } finally {
        await pool.end();
    }
}

testConnection();