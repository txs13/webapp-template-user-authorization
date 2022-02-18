FROM node:16-slim as build

WORKDIR /webapp-template-client/

COPY /package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /webapp-template-client/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]