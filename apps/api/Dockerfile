FROM node:alpine as builder

WORKDIR /app/builder
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npx nx build api

FROM node:alpine AS production-modules

WORKDIR /app/builder
COPY --from=builder /app/builder/dist/apps/api/package.json .
COPY --from=builder /app/builder/dist/apps/api/package-lock.json .

RUN npm install

FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /app
COPY ./assets ./assets
COPY --from=builder /app/builder/dist ./dist
COPY --from=production-modules /app/builder/node_modules ./node_modules

EXPOSE 3000

CMD ["./dist/apps/api/main.js"]
