// PRODUCTION DATABASE FIX
// This file ensures the correct database URL is used in production

export function getProductionDatabaseUrl(): string {
  // ALWAYS use the correct URL in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🔧 PRODUCTION: Forcing correct veganmapai database URL');
    return 'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solid-block-a59dqz1u.us-east-2.aws.neon.tech/veganmapai?sslmode=require';
  }
  
  // Otherwise use the environment variable
  return process.env.DATABASE_URL!;
}