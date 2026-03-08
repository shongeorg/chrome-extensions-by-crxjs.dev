# Radio Player — Chrome Extension

Інтернет-радіо плеєр для Chrome з підтримкою тисяч станцій з усього світу.

![Preview](./preview.jpg)

## Можливості

- 📻 **50 000+ радіостанцій** з API Radio Browser
- 🌍 **Вибір країни** — 10+ країн у швидкому доступі
- ▶️ **Плеєр** — Play/Pause, Stop, Previous, Next
- 🔊 **Гучність** — регулювання гучності
- 💾 **Збереження** — активна станція та країна зберігаються
- 🎨 **Atom Dark тема** — приємний темний інтерфейс
- 📱 **Картки станцій** — назва, bitrate, codec, favicon

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
│   ├── popup/           # Основне вікно з плеєром
│   │   ├── index.html
│   │   ├── main.js      # Логіка плеєра та API
│   │   └── style.css    # Atom Dark стилі
│   ├── sidepanel/       # Side panel
│   └── content/         # Content script
├── public/
│   └── logo.png
├── manifest.config.js   # Manifest V3 конфігурація
├── vite.config.js       # Vite конфігурація
└── package.json
```

## API

Використовується [Radio Browser API](https://www.radio-browser.info/):
- `https://de1.api.radio-browser.info/json/stations/bycountry/{country}`

## Технології

- **Vite** — швидка збірка
- **@crxjs/vite-plugin** — Chrome Extension плагін
- **Manifest V3** — остання версія маніфесту
- **Chrome Storage API** — збереження станції та країни
- **HTML5 Audio** — відтворення потоку

## Дозволи

- `storage` — збереження активної станції та країни
- `host_permissions` — доступ до API Radio Browser

## Ліцензія

MIT
