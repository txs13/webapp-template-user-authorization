FROM node:16-slim

WORKDIR /webapp-template-api

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "production-docker"]