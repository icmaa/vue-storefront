FROM node:16-alpine

WORKDIR /var/www

COPY package.json ./
COPY yarn.lock ./

RUN apk add --no-cache git curl wget \
  && yarn install --no-cache

COPY docker/vue-storefront/vue-storefront.sh /usr/local/bin/

CMD ["vue-storefront.sh"]
