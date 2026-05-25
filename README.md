# 🌤️ Weather App

> Минималистичное приложение для просмотра погоды и прогноза на 5 дней с геолокацией и избранными городами.

🔗 **Деплой сайта:** [weather-theta-lilac.vercel.app](https://weather-theta-lilac.vercel.app/weather/)

---

## 📸 Превью

![Weather App Screenshot](image-1.png)

---

## ✨ Возможности


| Функция | Описание |
|---------|----------|
| 🔍 **Поиск города** | Ввод названия на английском языке |
| 📍 **Геолокация** | Автоматическое определение погоды по вашему местоположению |
| 📅 **Прогноз на 5 дней** | Карточки с температурой и иконками на каждый день |
| ⭐ **Избранные города** | Сохранение городов в localStorage |
| 🌙 **Тёмная тема** | Переключение светлой/тёмной темы с сохранением |
| 🎨 **Адаптивный дизайн** | Корректное отображение на телефонах и планшетах |
| 🕐 **Часы с секундами** | Актуальное время в реальном времени |

---

## 🛠️ Технологии

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

- **Frontend:** HTML5, CSS3, JavaScript (ES6+, модульная структура)
- **API:** [OpenWeatherMap API](https://openweathermap.org) (Current Weather + 5 Day Forecast)
- **Хранение данных:** LocalStorage (для списка избранного и выбранной темы)
- **Сборщик:** Vite
- **Деплой:** Vercel

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com
cd название-репозитория
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корневом каталоге проекта и добавьте ваш API-ключ от OpenWeatherMap:
```env
VITE_WEATHER_API_KEY=ваш_api_ключ_сюда
```

### 4. Запуск в режиме разработки
```bash
npm run dev
```
Приложение будет доступно по адресу: `http://localhost:5173`

### 5. Сборка для продакшена
```bash
npm run build
```

---

## 📁 Структура проекта

```text
weather/
├── src/
│   └── modules/
│       ├── weather.js      # Запросы к API, обработка данных погоды
│       ├── favorites.js    # Логика списка избранного и LocalStorage
│       ├── theme.js        # Переключение и сохранение тёмной темы
│       └── time.js         # Обновление часов реального времени
├── app.js                  # Главный контроллер, инициализация модулей
├── index.html              # Основная HTML-разметка
├── style.css               # Стили приложения (включая переменные темы)
└── .env                    # Переменные окружения (игнорируется Git)
```

---

---

## 📌 Статус проекта

Проект находится в завершённом состоянии и выполняет все заявленные функции. Код структурирован и готов к демонстрации в качестве примера работы с ванильным JavaScript, модульной архитектурой и сторонними API.
