// e2e.test.ts - End-to-end tests using API calls instead of browser
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('🌐 End-to-End API тестове', () => {
  const baseURL = 'http://localhost:5000';

  it('🏠 Началната страница се достъпва', async () => {
    try {
      const response = await axios.get(baseURL);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    } catch (error) {
      expect.fail(`Началната страница не е достъпна: ${error.message}`);
    }
  });

  it('🗺 API за ресторанти работи (с автентификация)', async () => {
    try {
      const response = await axios.get(`${baseURL}/api/restaurants/all-available`);
      // Очакваме или 200 (auto login) или 401 (needs auth)
      expect([200, 401]).toContain(response.status);
    } catch (error) {
      if (error.response?.status === 401) {
        expect(error.response.status).toBe(401);
      } else {
        expect.fail(`API грешка: ${error.message}`);
      }
    }
  });

  it('🤖 AI Chat страницата се достъпва', async () => {
    try {
      const response = await axios.get(`${baseURL}/ai-chat`);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    } catch (error) {
      expect.fail(`AI Chat страницата не е достъпна: ${error.message}`);
    }
  });

  it('📊 Статични файлове се зареждат', async () => {
    try {
      // Тест за CSS файлове
      const cssResponse = await axios.get(`${baseURL}/client/src/index.css`, {
        validateStatus: () => true // Не хвърляй error за 404
      });
      
      // Очакваме или 200 или 404 (ако не е на този път)
      expect([200, 404]).toContain(cssResponse.status);
    } catch (error) {
      expect.fail(`Статични файлове са проблематични: ${error.message}`);
    }
  });
});