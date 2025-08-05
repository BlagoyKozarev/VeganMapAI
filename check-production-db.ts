import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from 'ws';
import * as schema from './shared/schema';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;

async function checkProductionDatabase() {
  console.log('=== PRODUCTION DATABASE CHECK ===\n');
  
  // Get production DATABASE_URL from environment
  const prodUrl = process.env.DATABASE_URL;
  
  if (!prodUrl) {
    console.error('❌ DATABASE_URL not found in environment!');
    process.exit(1);
  }
  
  console.log('DATABASE_URL:', prodUrl.substring(0, 50) + '...');
  
  try {
    // Create production connection
    const pool = new Pool({ connectionString: prodUrl });
    const db = drizzle({ client: pool, schema });
    
    // Count restaurants
    const result = await db.execute(sql`SELECT COUNT(*) as count FROM restaurants`);
    const count = parseInt(result.rows[0].count);
    
    console.log('\n📊 PRODUCTION DATABASE STATUS:');
    console.log(`Total restaurants: ${count}`);
    
    if (count === 0) {
      console.log('\n❌ PRODUCTION DATABASE IS EMPTY!');
      console.log('\nTo import data, run:');
      console.log('tsx import-to-production-direct.ts');
    } else {
      console.log('\n✅ Production database has data!');
      
      // Get sample restaurants
      const sampleResult = await db.execute(sql`SELECT name, address FROM restaurants LIMIT 3`);
      console.log('\nSample restaurants:');
      sampleResult.rows.forEach(r => {
        console.log(`- ${r.name} (${r.address})`);
      });
    }
    
    // Close connection
    await pool.end();
    
  } catch (error: any) {
    console.error('\n❌ ERROR connecting to production database:');
    console.error(error.message);
    
    if (error.message.includes('password')) {
      console.log('\n⚠️  This usually means the DATABASE_URL password is incorrect.');
      console.log('Please check your Production Database credentials in Replit Secrets.');
    }
  }
  
  console.log('\n=== CHECK COMPLETE ===');
  process.exit(0);
}

checkProductionDatabase();