FROM node:alpine as builder

WORKDIR /app/builder
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npx nx build moreloja

FROM nginx:alpine-slim

COPY --from=builder /app/builder/dist/apps/moreloja /usr/share/nginx/html
COPY ./apps/moreloja/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
