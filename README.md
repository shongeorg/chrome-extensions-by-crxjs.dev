# Stock Images — Chrome Extension

Розширення для Chrome для перегляду випадкових стокових зображень з популярних API.

![Preview](./preview.jpg)

## Можливості

- 🖼️ Випадкові зображення з трьох сервісів:
  - **Unsplash** — якісні фото від професійних фотографів
  - **Pexels** — безкоштовні стокові фото
  - **Pixabay** — велика бібліотека зображень
- 📋 Швидке копіювання URL зображення у різних розмірах:
  - Thumbnail
  - Small (400px)
  - Medium (800px)
  - Large (1600px)
  - Original
- 🎨 Темна тема інтерфейсу
- 🔄 Миттєве оновлення зображення

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
│   │   ├── main.js
│   │   └── style.css
│   ├── sidepanel/       # Side panel (заглушка)
│   └── content/         # Content script
├── public/
│   └── logo.png
├── manifest.config.js   # Manifest V3 конфігурація
├── vite.config.js       # Vite конфігурація
└── .env                 # API ключі
```

## API ключі

Створи файл `.env` у корені проекту:

```env
VITE_UNSPLASH_API_KEY=your_unsplash_key
VITE_PEXELS_API_KEY=your_pexels_key
VITE_PIXABAY_API_KEY=your_pixabay_key
```

## Технології

- **Vite** — збірка проекту
- **@crxjs/vite-plugin** — плагін для Chrome Extension
- **Manifest V3** — остання версія маніфесту Chrome

## Ліцензія

MIT
