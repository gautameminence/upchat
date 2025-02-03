FROM node:18-alpine

WORKDIR /app

RUN npm install --global pm2

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build
EXPOSE 3000

CMD [ "pm2-runtime", "start", "npm", "--", "run", "preview" ]