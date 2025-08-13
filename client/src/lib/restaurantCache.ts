
// 🔹 Глобален кеш в паметта
const restaurantCache: Record<string, { data: any; timestamp: number }> = {};

export async function fetchRestaurants(lat?: number, lng?: number) {
  // Ако няма координати, използваме общ ключ за всички ресторанти
  const key = lat && lng ? `${lat.toFixed(3)}|${lng.toFixed(3)}` : 'all-restaurants';
  const now = Date.now();
  const TTL = 300000; // 5 минути

  // 1) Проверка на кеша
  if (restaurantCache[key] && now - restaurantCache[key].timestamp < TTL) {
    console.log('[CACHE HIT]', key);
    return restaurantCache[key].data;
  }

  console.log('[CACHE MISS]', key);

  // 2) Fetch от API - използваме публичния endpoint
  let apiUrl = '/api/restaurants/public/map-data';
  if (lat && lng) {
    apiUrl += `?lat=${lat}&lng=${lng}`;
  }

  const res = await fetch(apiUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch restaurants: ${res.status}`);
  }
  const response = await res.json();
  
  // Извличаме данните от response структурата
  const data = response.success ? response.restaurants : [];

  // 3) Запис в кеша
  restaurantCache[key] = { data, timestamp: now };

  return data;
}

// Функция за изчистване на кеша
export function clearRestaurantCache() {
  Object.keys(restaurantCache).forEach(key => {
    delete restaurantCache[key];
  });
  console.log('[CACHE CLEARED]');
}

// Функция за получаване на статистики за кеша
export function getCacheStats() {
  const keys = Object.keys(restaurantCache);
  const now = Date.now();
  const TTL = 300000;
  
  const activeEntries = keys.filter(key => 
    now - restaurantCache[key].timestamp < TTL
  ).length;
  
  return {
    totalEntries: keys.length,
    activeEntries,
    expiredEntries: keys.length - activeEntries
  };
}
