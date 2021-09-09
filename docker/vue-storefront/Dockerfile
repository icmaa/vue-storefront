FROM node:16-alpine

WORKDIR /var/www
EXPOSE 3000

COPY package.json ./
COPY yarn.lock ./

COPY docker/vue-storefront/vue-storefront.sh /usr/local/bin/vue-storefront
RUN chmod +x /usr/local/bin/vue-storefront

RUN apk add --no-cache bash curl wget git

CMD ["vue-storefront"]
