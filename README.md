# Currency Converter — Chrome Extension

Конвертер валют з курсами в реальному часі в стилі **Dracula Theme**.

![Preview](./preview.jpg)

## Можливості

- 💱 **Двостороння конвертація** — вводиш в будь-яке поле, інше рахується автоматично
- 📊 **Курси валют** — 4 основні валюти (USD, EUR, GBP, UAH) з прямим та оберненим курсом
- 🌍 **25+ валют** — повний список для конвертації
- 🔄 **Live оновлення** — курси з API ExchangeRate-API
- 💾 **Збереження** — запам'ятовує обидві вибрані валюти
- 🎨 **Dracula Theme** — приємна темна тема
- ⇅ **Swap кнопка** — миттєвий обмін валют місцями

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
│   ├── popup/           # Основне вікно з конвертером
│   │   ├── index.html
│   │   ├── main.js      # Логіка конвертації та API
│   │   └── style.css    # Dracula стилі
│   ├── sidepanel/       # Side panel
│   └── content/         # Content script
├── public/
│   └── logo.png
├── manifest.config.js   # Manifest V3 конфігурація
├── vite.config.js       # Vite конфігурація
└── package.json
```

## API

Використовується [ExchangeRate-API](https://www.exchangerate-api.com/):
- `https://api.exchangerate-api.com/v4/latest/{base_currency}`

Безкоштовне API, не потребує ключа.

## Технології

- **Vite** — швидка збірка
- **@crxjs/vite-plugin** — Chrome Extension плагін
- **Manifest V3** — остання версія маніфесту
- **Chrome Storage API** — збереження вибраних валют
- **Dracula Theme** — кольорова схема (#282a36, #bd93f9, #8be9fd, #50fa7b)

## Дозволи

- `storage` — збереження вибраних валют (currencyFrom, currencyTo)
- `host_permissions` — доступ до API ExchangeRate-API

## Приклад курсів

```
🇺🇸 USD
1 USD = 43.79 UAH
1 UAH = 0.0229 USD

🇪🇺 EUR
1 EUR = 47.50 UAH
1 UAH = 0.0211 EUR

🇬🇧 GBP
1 GBP = 58.68 UAH
1 UAH = 0.0170 GBP
```

## Ліцензія

MIT
