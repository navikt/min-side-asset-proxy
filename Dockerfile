FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY index.js .
COPY storage .
COPY aliases-css.json .
COPY aliases-esm.json .

RUN npm ci

EXPOSE 8080:8080
CMD ["npm", "start"]