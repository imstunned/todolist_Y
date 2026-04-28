# Список задач на React + Vite

Проект реализует список задач с добавлением, удалением, переключением статуса выполнения и сохранением задач в `localStorage`. Также отображаются курсы USD/EUR и погода по текущей геолокации пользователя.

## Запуск локально

```bash
npm install
npm run dev
```

Приложение откроется по адресу: http://localhost:3000

## Погода

Для блока погоды нужен API-ключ OpenWeather. Создайте файл `.env` по примеру `.env.example`:

```bash
VITE_OPENWEATHER_API_KEY=ваш_ключ
```

После запуска браузер попросит разрешить доступ к геолокации.

## Проверка кода

```bash
npm run lint
```

## Сборка

```bash
npm run build
```

## Docker

Development-режим:

```bash
docker compose up --build
```

Production-сборка:

```bash
docker build -t todo-list-project .
docker run -p 80:80 todo-list-project
```

После production-запуска приложение доступно по адресу: http://localhost
