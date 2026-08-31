FROM php:8.1-apache

# Instala extensões necessárias para o Moodle
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libicu-dev libgd-dev \
    libsodium-dev libxml2-dev git unzip curl \
    && docker-php-ext-install \
    pdo pdo_pgsql pgsql intl gd zip soap sodium mbstring xml \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Configurações do PHP para o Moodle
RUN echo "max_input_vars = 5000" >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo "upload_max_filesize = 100M" >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo "post_max_size = 100M" >> /usr/local/etc/php/conf.d/moodle.ini \
    && echo "error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT" >> /usr/local/etc/php/conf.d/moodle.ini

# Configura Apache
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-enabled/moodle.conf

# Baixa o Moodle
RUN git clone https://github.com/moodle/moodle.git \
    --branch MOODLE_405_STABLE --depth 1 /var/www/html \
    && chown -R www-data:www-data /var/www/html

# Cria o diretório de dados
RUN mkdir -p /var/www/moodledata \
    && chown -R www-data:www-data /var/www/moodledata \
    && chmod 777 /var/www/moodledata

EXPOSE 80
