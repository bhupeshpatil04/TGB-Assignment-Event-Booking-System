FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npx","vite","preview","--port","4173","--host"]
