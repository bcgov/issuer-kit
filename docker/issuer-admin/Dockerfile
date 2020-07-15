FROM node:erbium
WORKDIR /app
#  Copy caddyfile for later use in chained build
COPY docker/issuer-admin/config/Caddyfile /app/config/Caddyfile
COPY issuer-admin/package*.json ./
RUN npm install
COPY issuer-admin/ .
RUN npm run build
