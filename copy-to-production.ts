import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

async function copyToProduction() {
  try {
    console.log('Проверка на базата данни...');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    // Вземи всички ресторанти от базата
    const result = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`Намерени ${result.rows[0].count} ресторанта в базата данни`);
    
    if (allRestaurants.length === 0) {
      console.log('Няма ресторанти за копиране!');
      return;
    }
    
    // Показваме първите няколко за проверка
    console.log('\nПримерни ресторанти:');
    allRestaurants.slice(0, 5).forEach(r => {
      console.log(`- ${r.name} (${r.address})`);
    });
    
    console.log(`\n✅ Базата данни има ${allRestaurants.length} ресторанта`);
    console.log('Всички ресторанти са вече в базата и ще се използват автоматично в production');
    
  } catch (error) {
    console.error('Грешка:', error);
  }
  
  process.exit(0);
}

copyToProduction();