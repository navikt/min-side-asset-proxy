FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY server.js .
COPY src ./src
COPY aliases ./aliases

RUN npm ci

EXPOSE 8080:8080
CMD ["npm", "start"]