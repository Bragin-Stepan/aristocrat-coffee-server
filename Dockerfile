FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

RUN yarn build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/
COPY --chown=nextjs:nodejs prisma ./prisma/

RUN apk add --no-cache openssl

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE ${APP_PORT}

ENTRYPOINT ["./entrypoint.sh"]

# CMD ["yarn", "start:prod"]




# FROM node:20-alpine AS builder

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./

# RUN yarn install --frozen-lockfile

# COPY . .

# RUN npx prisma generate

# RUN yarn build

# FROM node:20-alpine

# WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/package.json ./
# # COPY --chown=nextjs:nodejs prisma ./prisma/

# CMD ["yarn", "start:prod"]