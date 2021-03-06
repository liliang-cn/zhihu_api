FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
EXPOSE 3000
CMD [ "npm", "start"]