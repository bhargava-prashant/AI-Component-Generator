# Stage 1: Build React app
FROM node:18 as builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


EXPOSE 3000
CMD ["npm","start"]