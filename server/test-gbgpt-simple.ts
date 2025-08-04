// ТЕСТ КОД ЗА GBGPT - само за проверка на connectivity

// Създай файл: server/test-gbgpt-simple.ts

export async function testGBGPTConnection() {
  const apiUrl = 'http://192.168.0.245:5000/v1/completions';
  const apiKey = 'R@icommerce23';
  
  console.log('🔄 Testing GBGPT connection...');
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        prompt: "Test connection. Respond with just: OK",
        max_tokens: 10,
        temperature: 0
      }),
      signal: AbortSignal.timeout(30000) // 30 sec timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ GBGPT Response:', data);
    
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ GBGPT Test Failed:', error.message);
    return { success: false, error: error.message };
  }
}