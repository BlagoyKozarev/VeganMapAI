
// audio.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('🔊 Тест на аудио файл', () => {
  it('съществува и не е празен', () => {
    const filePath = './test-speech.mp3'; // Увери се, че този файл съществува
    const exists = fs.existsSync(filePath);
    expect(exists).toBe(true);

    if (exists) {
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(0); // минимум не празен файл
    }
  });
});
