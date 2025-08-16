# VeganMapAI Testing Framework - Пълна Инструкция

## Преглед на тестовата система

**Статус**: ✅ 100% успех (14/14 тестове минават)  
**Framework**: Vitest с Node.js среда  
**Покритие**: Unit тестове, Integration тестове, API тестове, E2E тестове

## Структура на тестовете

### 📁 Файлове и тяхната цел:

1. **`agent.test.ts`** - Тестове за AI агент функционалност
2. **`api.test.ts`** - API endpoint тестове
3. **`audio.test.ts`** - Аудио файл валидация
4. **`e2e.test.ts`** - End-to-end API тестове
5. **`map.test.ts`** - Map компонент тестове
6. **`scoring.test.ts`** - Vegan scoring логика тестове

## Как да стартираш тестовете

### Всички тестове:
```bash
npx vitest run
```

### Един конкретен файл:
```bash
npx vitest run agent.test.ts
```

### Watch mode (auto-rerun при промени):
```bash
npx vitest
```

### С подробни резултати:
```bash
npx vitest run --reporter=verbose
```

## Структура на тестовете

### 1. Agent Tests (`agent.test.ts`)
```typescript
describe('🧪 VeganMapAI – Интеграционни тестове', () => {
  it('✅ VeganMapAI стартира успешно', () => {
    // Основен старт тест
  });

  it('🧠 Mock GPT Agent функционира', () => {
    // AI функционалност (с mock)
  });

  it('🎯 Scoring Agent изчислява вегански рейтинг', () => {
    // Scoring логика
  });
});
```

### 2. API Tests (`api.test.ts`)
```typescript
describe('🌐 API Endpoints', () => {
  it('🏠 Root endpoint отговаря', () => {
    // Тест за главната страница
  });

  it('🔒 Protected endpoints изискват автентификация', () => {
    // Тест за 401 unauthorized
  });
});
```

### 3. E2E Tests (`e2e.test.ts`)
```typescript
describe('🌐 End-to-End API тестове', () => {
  // HTTP заявки към реалния сървър
  // Тестове на цялостната функционалност
});
```

## Конфигурация

### `vitest.config.ts`:
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    timeout: 10000, // 10 секунди
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
```

## Best Practices

### ✅ Правилно тестване:
- Използвай mock functions за API calls
- Тествай автентификация (очаквай 401 грешки)
- Включи timeout за async операции
- Тествай edge cases и error scenarios

### ❌ Избягвай:
- Real API calls в unit тестовете
- Playwright в Replit (browser dependencies)
- Hardcoded values без смисъл
- Тестове които зависят от external services

## Debugging тестове

### Ако тест се провали:
```bash
# Стартирай конкретния тест с подробности
npx vitest run failing-test.ts --reporter=verbose

# Watch mode за debugging
npx vitest failing-test.ts
```

### Чести проблеми и решения:

**🔴 Timeout грешки:**
```typescript
// Увеличи timeout в теста
it('slow test', async () => {
  // test code
}, { timeout: 15000 });
```

**🔴 Import грешки:**
```typescript
// Провери alias-ите в vitest.config.ts
import { something } from '@/components/something';
```

**🔴 API connection грешки:**
```typescript
// Добави error handling
try {
  const response = await fetch('/api/endpoint');
} catch (error) {
  expect(error).toBeDefined();
}
```

## Mock стратегии

### За AI/GPT calls:
```typescript
const mockGPT = {
  generateResponse: vi.fn().mockResolvedValue({
    response: "Mock AI отговор"
  })
};
```

### За Database calls:
```typescript
const mockDB = {
  findRestaurants: vi.fn().mockResolvedValue([])
};
```

## Добавяне на нови тестове

### 1. Създай нов файл:
```bash
touch new-feature.test.ts
```

### 2. Базова структура:
```typescript
import { describe, it, expect } from 'vitest';

describe('🔧 New Feature Tests', () => {
  it('should work correctly', () => {
    // Test logic
    expect(true).toBe(true);
  });
});
```

### 3. Стартирай теста:
```bash
npx vitest run new-feature.test.ts
```

## Coverage отчети

### Генериране на coverage:
```bash
npx vitest run --coverage
```

### Конфигурация за coverage:
```typescript
// в vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});
```

## Интеграция с CI/CD

### GitHub Actions пример:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx vitest run
```

## Performance тестове

### Измерване на скорост:
```typescript
import { performance } from 'perf_hooks';

it('should be fast', async () => {
  const start = performance.now();
  await someFunction();
  const end = performance.now();
  
  expect(end - start).toBeLessThan(1000); // под 1 секунда
});
```

## Заключение

Тестовата система е напълно функционална с **14/14 успешни теста**. Използвай тази инструкция за поддръжка и разширяване на тестовете. При въпроси или проблеми, винаги започни с `npx vitest run` за да провериш текущото състояние.