#!/bin/bash
# =============================================================
# deploy.sh — Скрипт первичной настройки VPS Beget
# Запуск: bash deploy.sh  (от root или пользователя с sudo)
# =============================================================

set -e  # выход при первой ошибке

DOMAIN="nahockey.ru"          # <-- ЗАМЕНИ НА СВОЙ ДОМЕН
APP_DIR="/var/www/nahockey"
DB_NAME="nahockey_db"
DB_USER="nahockey_user"
DB_PASS="REPLACE_DB_PASSWORD"    # <-- ЗАМЕНИ

echo "=== [1/8] Обновление системы ==="
apt update && apt upgrade -y

echo "=== [2/8] Установка пакетов ==="
apt install -y nginx postgresql postgresql-contrib git certbot python3-certbot-nginx

echo "=== [3/8] Установка Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

echo "=== [4/8] Настройка PostgreSQL ==="
sudo -u postgres psql <<EOSQL
CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

echo "=== [5/8] Создание директорий ==="
mkdir -p $APP_DIR/webapp
mkdir -p $APP_DIR/backend
mkdir -p /var/log/nahockey
chown -R $USER:$USER $APP_DIR

echo "=== [6/8] Клонирование проекта ==="
# Замени URL на свой репозиторий Git (GitHub/GitLab/Gitea)
# git clone https://github.com/YOUR_USER/nahockey.git $APP_DIR
echo "  --> Скопируй файлы проекта в $APP_DIR"
echo "  --> Или используй git clone"

echo "=== [7/8] Настройка Nginx ==="
cp $APP_DIR/nginx.conf.example /etc/nginx/sites-available/nahockey
sed -i "s/nahockey.ru/$DOMAIN/g" /etc/nginx/sites-available/nahockey
ln -sf /etc/nginx/sites-available/nahockey /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=== [8/8] SSL через Certbot ==="
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN

echo ""
echo "✅ Сервер настроен!"
echo "   Теперь залей код и запусти:"
echo "     cd $APP_DIR/backend && npm install && npm run build"
echo "     psql postgresql://$DB_USER:$DB_PASS@localhost/$DB_NAME -f src/db/schema.sql"
echo "     pm2 start ecosystem.config.cjs && pm2 save && pm2 startup"
echo "     cd $APP_DIR/webapp && npm install && npm run build"
