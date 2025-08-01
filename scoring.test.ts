
// scoring.test.ts
import { describe, it, expect } from 'vitest';

// Псевдо Vegan Score функция – замени с реалната логика
function computeVeganScore(data: any) {
  if (!data.isVegan) return 2;
  if (data.veganCert && data.reviews > 50) return 9;
  return 6;
}

describe('📊 Тест на Vegan Score логика', () => {
  it('връща 2 за не-веган обект', () => {
    expect(computeVeganScore({ isVegan: false })).toBe(2);
  });

  it('връща 9 за сертифициран и популярен веган', () => {
    expect(computeVeganScore({ isVegan: true, veganCert: true, reviews: 100 })).toBe(9);
  });

  it('връща 6 за среден случай', () => {
    expect(computeVeganScore({ isVegan: true, reviews: 10 })).toBe(6);
  });
});
