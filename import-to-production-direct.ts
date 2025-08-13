#!/usr/bin/env tsx
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// ВАЖНО: Този скрипт трябва да се изпълни с production DATABASE_URL
async function importToProduction() {
  console.log('🚀 Директен import в production базата данни...');
  
  // Проверяваме дали имаме production DATABASE_URL
  const productionUrl = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!productionUrl) {
    console.error('❌ Липсва DATABASE_URL. Моля конфигурирайте production database URL');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: productionUrl,
    ssl: { rejectUnauthorized: false } // За production Replit PostgreSQL
  });

  try {
    // Проверка на текущото състояние
    const countBefore = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`📊 Текущ брой ресторанти в production: ${countBefore.rows[0].count}`);
    
    if (parseInt(countBefore.rows[0].count) >= 408) {
      console.log('✅ Production базата вече има всички ресторанти!');
      process.exit(0);
    }
    
    // Четем SQL файла
    if (!fs.existsSync('production-import-simple.sql')) {
      console.error('❌ Липсва production-import-simple.sql файл');
      console.log('Моля изпълнете първо: tsx generate-simple-sql.ts');
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync('production-import-simple.sql', 'utf8');
    const statements = sqlContent.split(';\n').filter(stmt => 
      stmt.trim() && stmt.trim().startsWith('INSERT')
    );
    
    console.log(`📥 Импортиране на ${statements.length} ресторанта...`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const statement of statements) {
      try {
        await pool.query(statement + ';');
        imported++;
        if (imported % 50 === 0) {
          console.log(`   Импортирани: ${imported}/${statements.length}`);
        }
      } catch (err) {
        if (err.message.includes('duplicate key')) {
          skipped++;
        } else {
          console.error(`Грешка при импорт: ${err.message.substring(0, 100)}`);
        }
      }
    }
    
    // Финална проверка
    const countAfter = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log('\n=== РЕЗУЛТАТ ===');
    console.log(`✅ Успешно импортирани: ${imported}`);
    console.log(`⏭️  Пропуснати (дубликати): ${skipped}`);
    console.log(`📊 Общо ресторанти в production: ${countAfter.rows[0].count}`);
    
    if (parseInt(countAfter.rows[0].count) >= 408) {
      console.log('\n🎉 Production базата е готова с всички ресторанти!');
    }
    
  } catch (error) {
    console.error('❌ Критична грешка:', error.message);
    console.error('Детайли:', error);
  } finally {
    await pool.end();
  }
}

// Изпълнение
console.log('='.repeat(50));
console.log('IMPORT В PRODUCTION БАЗА ДАННИ');
console.log('='.repeat(50));
importToProduction();