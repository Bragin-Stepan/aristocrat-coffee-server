
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

#--------------------------------------------#

FROM node:20

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/

RUN yarn add -g prisma pm2
RUN prisma generate

CMD ["yarn", "start:migrate:prod"]





# FROM node:20-alpine AS builder

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# COPY . .
# RUN yarn prisma generate
# RUN yarn build

# #--------------------------------------------#

# FROM node:20

# WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/package.json ./
# COPY --from=builder /usr/src/app/prisma ./prisma/

# CMD ["yarn", "start:migrate:prod"]