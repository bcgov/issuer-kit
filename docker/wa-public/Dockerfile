FROM node:erbium
WORKDIR /app
#  Copy caddyfile for later use in chained build
COPY docker/wa-public/config/Caddyfile /app/config/Caddyfile
COPY wa-public/package*.json ./
RUN npm install
COPY wa-public/ .
RUN npm run build --prod
