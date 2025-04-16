#!/bin/bash

echo "🔨 Збірка продакшен версії..."
ng build --configuration production

if [ $? -ne 0 ]; then
  echo "❌ Помилка збірки! Вихід..."
  exit 1
fi

echo "📦 Копіювання на сервер..."
scp -r dist/mpx-full-frontend/* root@45.12.130.44:/var/www/mpx

if [ $? -ne 0 ]; then
  echo "❌ Помилка копіювання! Вихід..."
  exit 1
fi

echo "♻️ Перезапуск nginx..."
sudo systemctl reload nginx

echo "✅ Деплой завершено успішно!"
