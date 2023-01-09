FROM docker.io/node:hydrogen
WORKDIR /app
COPY issuer-web/package*.json ./
RUN npm install
COPY issuer-web/ .
RUN npm run build
