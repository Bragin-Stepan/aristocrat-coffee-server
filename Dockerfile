FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma ./prisma/

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

RUN yarn add @prisma/client
RUN yarn prisma generate

CMD ["sh", "-c", "yarn prisma migrate status && yarn prisma migrate deploy && yarn start:prod"]