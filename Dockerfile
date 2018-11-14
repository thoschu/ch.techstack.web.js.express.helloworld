FROM node:latest

MAINTAINER <Tom S. | thoschulte@gmail.com>

RUN apt-get update

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

HEALTHCHECK --interval=5s --timeout=5s CMD curl -f http://127.0.0.1:80 || exit 1

EXPOSE 80

CMD ["npm","run","prod"]
