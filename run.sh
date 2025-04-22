#!/bin/sh
set -e

yarn prisma db push
yarn prisma migrate deploy
# npx prisma migrate deploy

exec "$@"