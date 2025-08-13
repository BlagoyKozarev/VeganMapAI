
// agent-gpt-helper.ts

import axios from 'axios';

// 🔐 Ключът трябва да е добавен в Replit Settings → Secrets като OPENAI_KEY
const OPENAI_KEY = process.env.OPENAI_KEY;

// 📄 Фалшив лог за пример – замени с реален агент лог
const agentLog = [
  "[10:01] Agent started search for vegan places in Sofia.",
  "[10:02] Error: undefined property 'score' at scoring.js:41",
  "[10:03] Retried scoring. Same error.",
  "[10:04] Retried again. Same error.",
  "[10:05] Looping detected."
];

/**
 * Изпраща въпрос към GPT-4o
 */
async function askGPT(userPrompt: string): Promise<string> {
  if (!OPENAI_KEY) {
    return "❌ Няма зададен OPENAI_KEY. Провери Replit secrets.";
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Ти си AI помощник, който помага на агент, ако той се затрудни с код, логика или грешки. Дай ясни стъпки или предложения."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("❌ GPT грешка:", error.response?.data || error.message);
    return "⚠️ Възникна грешка при контакт с GPT.";
  }
}

/**
 * Главна входна точка: приема вход от чат, връща отговор
 */
export async function handleAgentChat(input: string): Promise<string> {
  if (input.trim().startsWith("/помощ")) {
    const latestLog = agentLog.slice(-5).join("\n");
    const question = input.replace("/помощ", "").trim() || "Агентът цикли или дава повтаряща се грешка.";
    const gptInput = `Потребителят поиска помощ. Ето какво се случва:\n${latestLog}\n\nДопълнителна информация: ${question}`;
    const reply = await askGPT(gptInput);
    return `🤖 GPT съвет: ${reply}`;
  }

  return "🤖 Обработвам нормално: " + input;
}

// 💬 Пример за локален тест:
(async () => {
  const input = "/помощ scoring не работи";
  const result = await handleAgentChat(input);
  console.log(result);
})();
