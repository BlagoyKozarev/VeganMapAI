# Vegan Score Agent — Единен контекст

## Архитектура (високо ниво)
- Компоненти: API Gateway, Scoring Service, Personalization, Explainability.
- Външни услуги: Google Maps API, Плащания (TBD), Логване/Мониторинг.

## Бизнес правила
- Цени: 4.99 / 11.99 / 14.99 USD (A/B тест по град/сегмент).
- Кеширане: 24h за статични заявки към Maps.

## Технически стандарти
- Runtime: Node 20 / Python 3.11.
- API: REST + Webhooks.
- Комити: Conventional Commits.

## Процес на промени
- Клонове: main (protected), chatgpt-dev, claude-dev.
- Правило: при съществена промяна обновявай този файл.

## Отговорности
- Codeowner: @BlagoyKozarev