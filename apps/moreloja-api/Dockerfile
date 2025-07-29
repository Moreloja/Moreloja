FROM node:alpine AS builder

WORKDIR /app/builder
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .
RUN yarn nx build moreloja-api

FROM node:alpine AS production-modules

WORKDIR /app/builder
COPY --from=builder /app/builder/dist/apps/moreloja-api/package.json .
COPY --from=builder /app/builder/dist/apps/moreloja-api/yarn.lock .

RUN yarn install

FROM gcr.io/distroless/nodejs24-debian12

WORKDIR /app
COPY ./assets ./assets
COPY --from=builder /app/builder/dist ./dist
COPY --from=production-modules /app/builder/node_modules ./node_modules

EXPOSE 3000

CMD ["./dist/apps/moreloja-api/main.js"]
