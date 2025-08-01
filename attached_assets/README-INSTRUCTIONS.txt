
📄 Инструкции за изпълнение на тестовете във VeganMapAI (Replit)

1. ✅ Инсталирай Vitest:
   В терминала напиши:
   npm install -D vitest

2. ✅ Добави следния ред в "scripts" частта на твоя package.json:
   "test": "vitest"

Пример:
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest"
}

3. ✅ Сложи файла agent.test.ts в главната директория на проекта (където е package.json)

4. ✅ Стартирай тестовете:
   npm run test

Това ще провери:
- Дали /помощ към GPT работи
- Дали приложението стартира успешно
- Дали агентът обработва нормален вход

🧠 Ако искаш да добавим и тест за картата, scoring или API, кажи на ChatGPT.
