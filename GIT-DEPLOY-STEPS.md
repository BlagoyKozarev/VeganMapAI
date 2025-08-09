# Git Deploy - Стъпка по стъпка

## 1️⃣ Push към GitHub
```bash
git push origin main
```

## 2️⃣ Настройка на GitHub Pages

1. Отидете на: **https://github.com/BlagoyKozarev/VeganMapAI**

2. Кликнете **Settings** (горе дясно)

3. От лявото меню изберете **Pages**

4. В секция **Source**:
   - Изберете: **Deploy from a branch**

5. В секция **Branch**:
   - Branch: **main**
   - Folder: **/public** ⚠️ ВАЖНО!

6. Кликнете **Save**

## 3️⃣ Проверка (след 2-3 минути)

Вашият сайт ще е на:
**https://blagoykozarev.github.io/VeganMapAI/**

Тествайте:
- Главна: https://blagoykozarev.github.io/VeganMapAI/
- Карта: https://blagoykozarev.github.io/VeganMapAI/test-map.html
- API docs: https://blagoykozarev.github.io/VeganMapAI/pages/api.html

## ⚠️ Важно
- Задължително изберете папка **/public**
- Първият deploy може да отнеме до 10 минути
- GitHub Pages е напълно безплатен