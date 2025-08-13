
// api.test.ts
import { describe, it, expect } from 'vitest';
import axios from 'axios';

describe('🌐 API тестове', () => {
  it('връща списък с обекти от /api/places (примерна симулация)', async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/places');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    } catch (err) {
      expect.fail("API не е достъпно на http://localhost:3000/api/places");
    }
  });
});
