
# #----------------------- builder ---------------------#
# FROM node:23 AS builder

# WORKDIR /usr/src/app

# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# COPY . .
# RUN npx prisma generate
# RUN yarn build

# #----------------------- Release ---------------------#
# FROM node:23

# WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/dist ./dist
# COPY --from=builder /usr/src/app/package.json ./
# COPY --from=builder /usr/src/app/prisma ./prisma/

# COPY run.sh .

# CMD ["sh", "run.sh"]


#----------------------- builder ---------------------#
FROM node:23-slim AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prisma generate
RUN yarn build

#----------------------- Release ---------------------#
FROM node:23-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
# COPY --from=builder /usr/src/app/prisma ./prisma/

# ENTRYPOINT ["./run.sh"]

CMD ["yarn", "start:prod"]