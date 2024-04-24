FROM node:18-alpine

WORKDIR /app

RUN npm cache clean --force

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
