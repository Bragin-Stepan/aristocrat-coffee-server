#!/bin/sh
set -e

# Применяем миграции
npx prisma migrate deploy

# Запускаем приложение
exec "$@"