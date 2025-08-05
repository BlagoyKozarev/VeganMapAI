// Verify production after redeploy
import https from 'https';

console.log('🔍 Проверка на production след redeploy...\n');

function checkProductionAPI() {
  return new Promise((resolve) => {
    https.get('https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log('✅ API отговор:');
          console.log(`   Брой ресторанти: ${json.count}`);
          console.log(`   Масив с ресторанти: ${json.restaurants?.length || 0} елемента`);
          console.log(`   Успешен отговор: ${json.success}`);
          
          if (json.count > 0) {
            console.log('\n🎉 УСПЕХ! Production базата вече има ресторанти!');
            console.log('   Картата трябва да работи нормално.');
            
            if (json.restaurants?.length > 0) {
              console.log('\n📍 Примерни ресторанти:');
              json.restaurants.slice(0, 3).forEach(r => {
                console.log(`   - ${r.name} (${r.veganScore ? 'Score: ' + r.veganScore : 'No score'})`);
              });
            }
          } else {
            console.log('\n❌ Production базата все още е празна!');
            console.log('   Redeploy може да не е завършил или има проблем.');
          }
          
          resolve(json);
        } catch (e) {
          console.error('❌ Грешка при парсване:', e.message);
          console.log('Raw response:', data.substring(0, 200));
          resolve(null);
        }
      });
    }).on('error', (e) => {
      console.error('❌ Грешка при заявката:', e.message);
      resolve(null);
    });
  });
}

// Check multiple times in case deployment is still propagating
async function checkWithRetries() {
  for (let i = 0; i < 3; i++) {
    if (i > 0) {
      console.log(`\n⏳ Опит ${i + 1}/3...`);
    }
    
    const result = await checkProductionAPI();
    if (result && result.count > 0) {
      console.log('\n🌐 Проверете сайта: https://vegan-map-ai-bkozarev.replit.app');
      return;
    }
    
    if (i < 2) {
      console.log('   Изчакване 5 секунди...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n📝 Препоръки:');
  console.log('1. Проверете дали redeploy е завършил успешно');
  console.log('2. Опитайте да отворите сайта в нов прозорец (инкогнито)');
  console.log('3. Ако не работи, може да се наложи ръчен импорт в production базата');
}

checkWithRetries();