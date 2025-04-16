#!/bin/bash

echo "🔄 Деплой почався..."

# 1. Перейти до папки проєкту
cd /root/mpx.V.2 || exit

# 2. Бекенд
echo "📦 Встановлення залежностей бекенду..."
cd mpx-full-backend || exit
npm install

echo "🚀 Запуск бекенду..."
pkill -f "node server.js"
nohup node server.js > backend.log 2>&1 &

# 3. Фронтенд
echo "📦 Встановлення залежностей фронтенду..."
cd ../mpx-full-frontend || exit
npm install

echo "🛠 Збірка фронтенду..."
npm run build

echo "📂 Копіювання файлів у /var/www/mpx (без видалення)..."
cp -r dist/mpx-full-frontend/* /var/www/mpx/

echo "✅ Деплой завершено!"
