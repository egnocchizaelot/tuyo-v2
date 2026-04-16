#OPCION 1
FROM node:8

WORKDIR /app

COPY package.json bower.json ./
RUN npm install -g grunt-cli@1.3.2
RUN npm install

COPY . .
RUN grunt --force

EXPOSE 9000
# aplication start command
CMD [ "grunt", "serve", "--force"]
