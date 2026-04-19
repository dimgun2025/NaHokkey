#!/bin/bash
# update.sh — быстрое обновление деплоя после git push
APP_DIR="/var/www/nahockey"

echo "=== Обновление кода ==="
cd $APP_DIR && git pull origin main

echo "=== Сборка фронтенда ==="
cd $APP_DIR/webapp && npm install && npm run build

echo "=== Сборка и перезапуск бэкенда ==="
cd $APP_DIR/backend && npm install && npm run build
pm2 restart nahockey-api

echo "✅ Обновление завершено"
