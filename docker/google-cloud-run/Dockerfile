FROM node:16-slim AS build_img

WORKDIR /var/www

COPY config ./config
COPY core ./core
COPY dist ./dist
COPY src ./src
COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add node-prune && \
    node-prune

FROM node:16-slim

WORKDIR /var/www
EXPOSE 3000

COPY --from=build_img /var/www/ ./

CMD [ "yarn", "start" ]
