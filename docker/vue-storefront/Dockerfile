FROM node:16-alpine

EXPOSE 3000
WORKDIR /var/www

COPY package.json ./
COPY yarn.lock ./

COPY docker/vue-storefront/vue-storefront.sh /usr/local/bin/vue-storefront
RUN chmod +x /usr/local/bin/vue-storefront

RUN apk add --no-cache bash curl wget git \
  && yarn install --no-cache

ENTRYPOINT ["vue-storefront"]
