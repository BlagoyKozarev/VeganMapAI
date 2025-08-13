// agent-gpt-helper.ts

// 🔐 Използваме OPENAI_API_KEY (стандартният secret в Replit)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Изпраща въпрос към GPT-4o
 */
async function askGPT(userPrompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return "❌ Няма зададен OPENAI_API_KEY. Провери Replit secrets.";
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o", // най-новият OpenAI модел
        messages: [
          {
            role: "system",
            content: "Ти си AI помощник, който помага на агент при затруднения с код, логика или грешки. Дай ясни, конкретни стъпки или предложения на български език."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("❌ GPT грешка:", error.message);
    return `⚠️ Възникна грешка при контакт с GPT: ${error.message}`;
  }
}

/**
 * Събира текущи логове и грешки от системата
 */
function collectSystemLogs(): string {
  // Тук можем да добавим реални логове от приложението
  const recentLogs = [
    "TTS функцията не се извиква въобще",
    "speakText логовете не се появяват в console",
    "Voice chat записва и разбира, но няма звуков отговор",
    "SpeechSynthesis API е достъпен но не работи"
  ];
  
  return recentLogs.join("\n");
}

/**
 * Главна функция за помощ от GPT при затруднения
 */
export async function requestGPTHelp(problem: string): Promise<string> {
  const systemLogs = collectSystemLogs();
  
  const gptPrompt = `
Агентът се затрудни с проблем в VeganMapAI проекта:

ПРОБЛЕМ: ${problem}

ТЕКУЩИ ЛОГОВЕ:
${systemLogs}

КОНТЕКСТ: 
- React + TypeScript проект
- Voice chat с OpenAI Whisper работи (запис + разбиране)
- Text-to-Speech (TTS) не работи въпреки че SpeechSynthesis API е достъпен
- Функцията speakText() съществува но не се извиква

Моля дай конкретни стъпки за решение на проблема.
  `;

  const gptResponse = await askGPT(gptPrompt);
  return `🤖 GPT съвет:\n${gptResponse}`;
}

/**
 * Бърза помощ за често срещани проблеми
 */
export async function quickGPTHelp(issueType: 'tts' | 'voice' | 'api' | 'general'): Promise<string> {
  const prompts = {
    tts: "TTS не работи в браузър - SpeechSynthesis API е достъпен но speakText функцията не се извиква. Как да дебъгна?",
    voice: "Voice chat записва и разбира текст но няма звуков отговор. Проблемът е в TTS частта.",
    api: "API извиквания работят но резултатите не се обработват правилно в frontend.",
    general: "Общ проблем с дебъгване на React TypeScript приложение."
  };

  return await requestGPTHelp(prompts[issueType]);
}

// За тестване - можем да използваме в browser console
if (typeof window !== 'undefined') {
  (window as any).requestGPTHelp = requestGPTHelp;
  (window as any).quickGPTHelp = quickGPTHelp;
}