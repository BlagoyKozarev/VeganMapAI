import { AI_CONFIG } from './config/aiConfig';

// Тест скрипт за GBGPT scoring
console.log('🔍 Current AI Configuration:');
console.log('GBGPT_ENABLED:', AI_CONFIG.GBGPT_ENABLED);
console.log('GBGPT_ENDPOINT:', AI_CONFIG.GBGPT_ENDPOINT || '❌ Not configured');
console.log('GBGPT_API_KEY:', AI_CONFIG.GBGPT_API_KEY ? '✅ Set' : '❌ Not set');
console.log('OPENAI_ENABLED:', AI_CONFIG.OPENAI_ENABLED);

console.log('\n📝 За да активираш GBGPT:');
console.log('1. Стартирай ngrok: ngrok http 5000');
console.log('2. Вземи ngrok URL (например: https://abc123.ngrok.io)');
console.log('3. Добави в Replit secrets:');
console.log('   GBGPT_ENABLED=true');
console.log('   GBGPT_ENDPOINT=https://abc123.ngrok.io/v1/completions');
console.log('4. Рестартирай приложението');
console.log('\n✅ След това scoreAgent ще използва GBGPT вместо OpenAI!');