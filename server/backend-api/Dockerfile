FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]