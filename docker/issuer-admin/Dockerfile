FROM node:erbium
WORKDIR /app
#  Copy caddyfile for later use in chained build
COPY docker/wa-admin/config/Caddyfile /app/config/Caddyfile
COPY wa-admin/package*.json ./
RUN npm install
COPY wa-admin/ .
RUN npm run build --prod
