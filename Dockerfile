FROM node:16.8.0-alpine3.11

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

CMD [ "node", "--max-old-space-size=8192" ,"./dist/index.js" ]
