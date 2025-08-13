// В server/config/aiConfig.ts (нов файл)
export const AI_CONFIG = {
  GBGPT_ENABLED: process.env.GBGPT_ENABLED === 'true',
  GBGPT_ENDPOINT: process.env.GBGPT_ENDPOINT || '', // ще добавиш ngrok URL тук
  GBGPT_API_KEY: process.env.GBGPT_API_KEY || 'R@icommerce23',
  OPENAI_ENABLED: !!process.env.OPENAI_API_KEY
};