FROM node:16.8.0-alpine3.11

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY eula_db ./eula_db
COPY eula ./eula

# RUN ls -all | echo > /tmp/test.txt
RUN yarn global add typescript

WORKDIR /app/eula_db
RUN yarn install
RUN yarn run build
WORKDIR /app/eula
RUN yarn
RUN yarn build

WORKDIR /app

ENV NODE_ENV production

CMD [ "node", "./eula/dist/index.js" ]
