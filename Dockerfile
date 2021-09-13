FROM node:16.8.0-alpine3.11

WORKDIR /app

COPY . .

# RUN ls -all | echo > /tmp/test.txt
RUN yarn global add typescript


RUN yarn
RUN yarn build


CMD [ "node", "./eula/dist/index.js" ]
