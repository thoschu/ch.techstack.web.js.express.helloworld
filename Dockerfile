FROM node:onbuild

MAINTAINER <Tom S. | thoschulte@gmail.com>

RUN apt-get update

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

EXPOSE 80

CMD ["npm","start"]