FROM node:latest

WORKDIR /

COPY package.json ./

RUN npm install

COPY . .

RUN cp .env.example .env

RUN npm run build

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]
