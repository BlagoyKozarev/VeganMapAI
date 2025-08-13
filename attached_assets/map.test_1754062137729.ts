
// map.test.ts
import { describe, it, expect } from 'vitest';

// Псевдо функция – замени с реалната инициализация на картата
function initializeMap() {
  return {
    center: [42.6977, 23.3219],
    zoom: 13,
    layers: ['OpenStreetMap']
  };
}

describe('🗺 Тест на картата', () => {
  it('инициализира се с правилен център и мащаб', () => {
    const map = initializeMap();
    expect(map.center).toEqual([42.6977, 23.3219]);
    expect(map.zoom).toBe(13);
  });
});
