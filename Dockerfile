FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .
RUN yarn start:prod

EXPOSE ${APP_PORT}

CMD ["yarn", "start:prod"]