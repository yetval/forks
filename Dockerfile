FROM serversideup/php:8.4-fpm AS composer-stage
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

FROM node:22-alpine AS node-builder
RUN apk add --no-cache php83
    ln -sf /usr/bin/php83 /usr/local/bin/php

WORKDIR /app
COPY . .
COPY --from=composer-stage /var/www/html/vendor ./vendor

# Fake env so Laravel can bootstrap without a real DB/key during wayfinder:generate
ENV APP_KEY=base64:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa= \
    APP_ENV=production \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/tmp/build.sqlite

RUN npm ci && npm run build

FROM serversideup/php:8.4-fpm AS production

COPY --chown=www-data:www-data . /var/www/html
COPY --from=composer-stage --chown=www-data:www-data /var/www/html/vendor /var/www/html/vendor
COPY --from=node-builder --chown=www-data:www-data /app/public/build /var/www/html/public/build

ENV PHP_OPCACHE_ENABLE=1 \
    AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_STORAGE_LINK=true \
    AUTORUN_LARAVEL_MIGRATION=true \
    AUTORUN_LARAVEL_CONFIG_CACHE=true \
    AUTORUN_LARAVEL_ROUTE_CACHE=true \
    AUTORUN_LARAVEL_VIEW_CACHE=true \
    AUTORUN_LARAVEL_EVENT_CACHE=true
