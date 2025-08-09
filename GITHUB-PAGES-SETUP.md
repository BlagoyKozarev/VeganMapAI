# GitHub Pages Setup за VeganMapAI

## Стъпка 1: Push към GitHub
```bash
git push origin main
```

## Стъпка 2: Настройка на GitHub Pages

1. Отидете на: https://github.com/BlagoyKozarev/VeganMapAI

2. Кликнете на **Settings** (в горния таб)

3. Скролнете до **Pages** (в лявото меню)

4. Под **Source** изберете:
   - **Deploy from a branch**
   
5. Под **Branch** настройте:
   - Branch: **main**
   - Folder: **/public** (ВАЖНО!)
   
6. Натиснете **Save**

7. Изчакайте 2-3 минути

8. Вашият сайт ще бъде на:
   **https://blagoykozarev.github.io/VeganMapAI/**

## Проверка

След deploy, тествайте:
- Главна страница: https://blagoykozarev.github.io/VeganMapAI/
- Карта: https://blagoykozarev.github.io/VeganMapAI/test-map.html
- API docs: https://blagoykozarev.github.io/VeganMapAI/pages/api.html
- Settings: https://blagoykozarev.github.io/VeganMapAI/pages/settings.html

## Забележки
- Първият deploy може да отнеме до 10 минути
- GitHub Pages е напълно безплатен
- Автоматично HTTPS сертификат
- CDN за бързо зареждане