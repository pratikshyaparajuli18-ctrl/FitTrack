FROM php:8.3-apache

# Install system dependencies and common PHP extensions (e.g., PostgreSQL, MySQL)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysq

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

# Adjust file permissions so Apache can read/write properly
RUN chown -R www-data:www-data /var/www/html

# Document that the container listens on port 80
EXPOSE 80
