FROM node:22-alpine
WORKDIR /app

COPY src/package.json ./
RUN npm install

COPY ./ .
RUN npm run build

EXPOSE 3000
CMD ["node", "./build/index.js"]