// PRODUCTION DATABASE FIX
// This file ensures the correct database URL is used in production

export function getProductionDatabaseUrl(): string {
  // If we're in production and DATABASE_URL is wrong, use the correct one
  if (process.env.NODE_ENV === 'production') {
    const currentUrl = process.env.DATABASE_URL || '';
    
    // Check if it's pointing to the wrong database
    if (currentUrl.includes('/neondb') || !currentUrl.includes('/veganmapai')) {
      console.log('🔧 FIXING: Wrong DATABASE_URL detected in production');
      console.log('🔧 Switching to correct veganmapai database');
      return 'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solid-block-a59dqz1u.us-east-2.aws.neon.tech/veganmapai?sslmode=require';
    }
  }
  
  // Otherwise use the environment variable
  return process.env.DATABASE_URL!;
}