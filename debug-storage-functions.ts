import { db } from './server/db.js';
import { restaurants } from './shared/schema.js';
import { sql } from 'drizzle-orm';

async function debugStorageFunctions() {
    console.log('=== STORAGE FUNCTION DEBUG ===');
    console.log('Time:', new Date().toISOString());
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    
    try {
        // Test raw database query
        const rawCount = await db.select().from(restaurants);
        console.log(`\n1. Raw DB query returns: ${rawCount.length} restaurants`);
        
        // Test with vegan score filter
        const withScores = await db.select().from(restaurants).where(sql`vegan_score != '0.00'`);
        console.log(`2. With vegan scores filter: ${withScores.length} restaurants`);
        
        // Test getAllRestaurantsWithScores function from storage
        const storage = await import('./server/storage.js');
        const storageInstance = new storage.DatabaseStorage();
        const functionResult = await storageInstance.getAllRestaurantsWithScores();
        console.log(`3. getAllRestaurantsWithScores returns: ${functionResult.length} restaurants`);
        
        // Sample data inspection
        if (rawCount.length > 0) {
            console.log('\nSample restaurant data:');
            console.log({
                id: rawCount[0].id,
                name: rawCount[0].name,
                veganScore: rawCount[0].veganScore,
                latitude: rawCount[0].latitude,
                longitude: rawCount[0].longitude,
                address: rawCount[0].address
            });
        }
        
        // Check for any filters in storage function
        console.log('\n4. Checking storage function logic...');
        console.log('Function source preview:', storageInstance.getAllRestaurantsWithScores.toString().substring(0, 200) + '...');
        
        return {
            rawCount: rawCount.length,
            withScores: withScores.length,
            functionResult: functionResult.length,
            mismatch: rawCount.length !== functionResult.length
        };
    } catch (error) {
        console.error('ERROR:', error);
        return { error: error.message };
    }
}

debugStorageFunctions().then(result => {
    console.log('\n=== SUMMARY ===');
    console.log(result);
    if (result.mismatch) {
        console.log('⚠️ MISMATCH DETECTED! Storage function returns different count than raw query!');
    }
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});