FROM node:16-alpine

WORKDIR /var/www
EXPOSE 3000

COPY package.json ./
COPY yarn.lock ./

COPY docker/vue-storefront/vue-storefront.sh /usr/local/bin/vue-storefront
RUN chmod +x /usr/local/bin/vue-storefront

RUN apk add --no-cache \
    python3 make g++ ca-certificates \
    gcc libgcc libstdc++ linux-headers \
    bash curl wget git rsync

RUN yarn global add @icmaa/config-sync

CMD ["vue-storefront"]
