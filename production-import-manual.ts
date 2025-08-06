import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function importToProduction() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    console.log('📊 Проверка на текущото състояние...');
    
    // Проверка на броя ресторанти
    const countResult = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    const currentCount = parseInt(countResult.rows[0].count);
    
    console.log(`🔍 Намерени ${currentCount} ресторанта в базата`);
    
    if (currentCount >= 408) {
      console.log('✅ Базата вече съдържа всички ресторанти!');
      process.exit(0);
    }
    
    // Изпълнение на SQL файла за импорт
    console.log('📥 Импортиране на ресторанти от SQL файла...');
    
    const sqlFile = fs.readFileSync('./production-import-simple.sql', 'utf8');
    
    // Разделяме на отделни заявки
    const statements = sqlFile.split(';').filter(stmt => stmt.trim());
    
    let imported = 0;
    for (const statement of statements) {
      if (statement.trim().startsWith('INSERT INTO restaurants')) {
        try {
          await pool.query(statement + ';');
          imported++;
        } catch (err) {
          // Игнорираме дубликати
          if (!err.message.includes('duplicate key')) {
            console.error('Грешка при импорт:', err.message);
          }
        }
      }
    }
    
    console.log(`✅ Импортирани ${imported} ресторанта`);
    
    // Финална проверка
    const finalCount = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`📊 Общо ресторанти в базата: ${finalCount.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Грешка:', error.message);
  } finally {
    await pool.end();
  }
}

importToProduction();