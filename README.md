# Tasks — Chrome Extension

Сучасний Todo-застосунок у вигляді Chrome Extension з темою **Atom Dark**.

![Preview](./preview.jpg)

## Можливості

- ✅ **Додавання задач** — швидке створення нових справ
- ✔️ **Відмітка виконаних** — checkbox для завершених задач
- 🗑️ **Видалення** — кнопка видалення для кожної задачі
- 💾 **Збереження** — автоматичне збереження в `chrome.storage.local`
- 📊 **Статистика** — лічильник Total/Completed/Pending
- 🎨 **Atom Dark тема** — приємна темна тема у стилі Atom Editor
- 🌙 **Анімації** — плавні переходи та ефекти

## Встановлення

### Розробка

```bash
# Встановити залежності
npm install

# Запустити dev-сервер
npm run dev
```

Після запуску:
1. Відкрий Chrome → `chrome://extensions/`
2. Увімкни **Developer mode**
3. Натисни **Load unpacked**
4. Обери папку `dist`

### Продакшн

```bash
npm run build
```

Зібране розширення буде у папці `release/` у вигляді ZIP-архіву.

## Структура проекту

```
tasks/
├── src/
│   ├── popup/           # Основне вікно розширення
│   │   ├── index.html
│   │   ├── main.js      # Логіка Todo застосунку
│   │   └── style.css    # Atom Dark стилі
│   ├── sidepanel/       # Side panel
│   └── content/         # Content script
├── public/
│   └── logo.png
├── manifest.config.js   # Manifest V3 конфігурація
├── vite.config.js       # Vite конфігурація
└── package.json
```

## Технології

- **Vite** — швидка збірка проекту
- **@crxjs/vite-plugin** — плагін для Chrome Extension
- **Manifest V3** — остання версія маніфесту Chrome
- **Vanilla JavaScript** — без фреймворків
- **CSS Variables** — гнучка система стилів

## Дозволи

- `storage` — збереження задач у локальному сховищі Chrome

## Скріншот

Темна тема в стилі Atom Editor з:
- Блакитним акцентом (`#61afef`)
- Зеленим для виконаних задач (`#98c379`)
- Червоним для кнопок видалення (`#e06c75`)

## Ліцензія

MIT
