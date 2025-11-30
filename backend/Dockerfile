FROM php:8.4-fpm

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリの設定
WORKDIR /var/www/html

# Composerファイルをコピー
COPY composer.json composer.lock ./

# 依存関係をインストール
RUN composer install --no-dev --optimize-autoloader --no-scripts

# アプリケーションコードをコピー
COPY . .

# パーミッション設定
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel用のPHP設定
RUN echo "upload_max_filesize = 64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/uploads.ini

# ポート公開
EXPOSE 8000

# 起動コマンド
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]