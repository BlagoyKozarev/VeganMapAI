
// api.test.ts
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('🌐 API тестове', () => {
  it('тества /api/restaurants/all-available endpoint (очаква autentification)', async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants/all-available');
      // Ако потребителят е автентикиран, очакваме 200 с данни
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    } catch (err) {
      // Ако потребителят не е автентикиран, очакваме 401 
      if (err.response?.status === 401) {
        expect(err.response.status).toBe(401);
        expect(err.response.data).toHaveProperty('message');
      } else {
        expect.fail(`Неочаквана API грешка: ${err.message}`);
      }
    }
  });

  it('тества /api/auth/user endpoint', async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/user');
      // Очакваме 401 за неоторизиран потребител или 200 за автентикиран
      expect([200, 401]).toContain(response.status);
    } catch (err) {
      // Axios хвърля error за 401, което е очаквано
      expect(err.response?.status).toBe(401);
    }
  });
});
