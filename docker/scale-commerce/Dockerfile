FROM node:16-alpine AS build_img

WORKDIR /var/www

RUN apk update && \
    apk add python3 make g++ git bash && \
    rm -rf /var/cache/apk/*

COPY config ./config
COPY core ./core
COPY dist ./dist
COPY src ./src
COPY package.json yarn.lock ./

RUN yarn install --production

RUN yarn global add node-prune && \
    node-prune

FROM node:16-alpine

WORKDIR /var/www
EXPOSE 3000

COPY --from=build_img /var/www/ ./

ENV VSF_SERVER_HOST=0.0.0.0
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
ENV NODE_APP_INSTANCE=sc-imp
ENV NODE_CONFIG_ENV=test-sc

CMD [ "yarn", "start:pm2" ]
