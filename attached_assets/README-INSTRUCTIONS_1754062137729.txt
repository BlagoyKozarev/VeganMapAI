
📄 Инструкции за изпълнение на тестовете във VeganMapAI (Replit)

1. ✅ Инсталирай зависимостите:
   npm install -D vitest axios

2. ✅ Включи следния ред в "scripts" в твоя package.json:
   "test": "vitest"

Пример:
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest"
}

3. ✅ Сложи всички `*.test.ts` файлове в главната директория

4. ✅ За `audio.test.ts`:
   Увери се, че файлът `test-speech.mp3` съществува в главната папка. Ако не, можеш да използваш файл от твоя проект.

5. ✅ За `api.test.ts`:
   Стартирай Replit бекенда така, че `/api/places` да отговаря локално на порт 3000
   (или промени URL, ако е различен)

6. ✅ Стартирай тестовете:
   npm run test
