FROM node:16-alpine AS build
WORKDIR /app
COPY / ./
COPY package*.json ./

RUN npm install && \
    npx ng build --prod
COPY . .

FROM nginx:stable-alpine
WORKDIR /app
COPY --from=build /app/dist/past /usr/share/nginx/html

