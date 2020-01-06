FROM node:11-alpine as build

ARG REACT_APP_GAME_URL
ARG REACT_APP_GAME_WS_URL

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent

COPY . /app
RUN npm run build

FROM nginx:1.16.0-alpine
COPY --from=build /app/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
