import { db } from './server/db';
import { restaurants } from './shared/schema';
import { sql } from 'drizzle-orm';

async function debugStorageFunctions() {
    console.log('=== STORAGE FUNCTION DEBUG ===');
    
    try {
        // Test raw database query
        const rawCount = await db.select().from(restaurants);
        console.log(`Raw DB query returns: ${rawCount.length} restaurants`);
        
        // Test with scores filter
        const withScores = await db.select().from(restaurants).where(sql`vegan_score != '0.00'`);
        console.log(`With scores filter: ${withScores.length} restaurants`);
        
        // Sample data inspection
        if (rawCount.length > 0) {
            console.log('Sample restaurant:', {
                name: rawCount[0].name,
                veganScore: rawCount[0].veganScore,
                latitude: rawCount[0].latitude,
                longitude: rawCount[0].longitude
            });
        }
        
        return {
            rawCount: rawCount.length,
            withScores: withScores.length
        };
    } catch (error) {
        console.error('Database query error:', error);
        return { error: error.message };
    }
}

debugStorageFunctions().then(console.log).catch(console.error);