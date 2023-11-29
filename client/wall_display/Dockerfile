FROM node:alpine as builder

WORKDIR /usr/wall_display
COPY ./ /usr/wall_display/

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/wall_display/build/ /usr/share/nginx/html
