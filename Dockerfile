FROM php:8.4-cli AS builder

RUN apt-get update && apt-get install -y curl unzip libonig-dev libsqlite3-dev \
    && docker-php-ext-install mbstring pdo_sqlite \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts
RUN npm ci

ENV APP_KEY=base64:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa= \
    APP_ENV=production \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/tmp/build.sqlite

RUN npm run build

FROM serversideup/php:8.4-fpm AS production

COPY --chown=www-data:www-data . /var/www/html
COPY --from=builder --chown=www-data:www-data /app/vendor /var/www/html/vendor
COPY --from=builder --chown=www-data:www-data /app/public/build /var/www/html/public/build

ENV PHP_OPCACHE_ENABLE=1 \
    AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_STORAGE_LINK=true \
    AUTORUN_LARAVEL_MIGRATION=true \
    AUTORUN_LARAVEL_CONFIG_CACHE=true \
    AUTORUN_LARAVEL_ROUTE_CACHE=true \
    AUTORUN_LARAVEL_VIEW_CACHE=true \
    AUTORUN_LARAVEL_EVENT_CACHE=true
