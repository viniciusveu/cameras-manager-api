# dev
FROM node:alpine AS dev

WORKDIR /app

COPY tsconfig*.json ./
COPY package*.json ./

RUN npm install

RUN npm run build

COPY . .

# EXPOSE 3000

# CMD [ "npm", "run", "start:dev" ]