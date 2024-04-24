FROM node:21-alpine

WORKDIR /app

COPY . .

RUN npm ci

RUN apk add --no-cache \
    ghostscript \
    graphicsmagick

CMD ["npm", "run", "dev"]