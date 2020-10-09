# build phase
FROM node:alpine
RUN npm install -g serve
WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "server.js"]
