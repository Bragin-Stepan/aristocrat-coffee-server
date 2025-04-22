# FROM node:20-alpine

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production

# COPY . .
# RUN yarn start:prod

# EXPOSE ${APP_PORT}

# CMD ["yarn", "start:prod"]


FROM node:20-alpine AS builder

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./

EXPOSE ${APP_PORT}
CMD ["yarn", "start:prod"]