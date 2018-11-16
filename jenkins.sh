#!/usr/bin/env bash
# https://hub.docker.com/r/thoschu/jenkins-slave-jdk-maven-git-curl-docker-run-inside/

## Test
npm install
npm run jshint
npm run doc
npm run test:qa

## Build
BUILD="-build."
PACKAGE_VERSION=$(cat package.json | grep -w "version" | egrep -o "([0-9]{1,}\.)+[0-9]{1,}")
APP_VERSION=$PACKAGE_VERSION${BUILD}${BUILD_NUMBER}
echo $APP_VERSION
docker build -t thoschu/test-a:${APP_VERSION} .
docker tag thoschu/test-a:${APP_VERSION} thoschu/test-a:latest
docker login --username=$DOCKER_USER --password=$DOCKER_PASS
docker push thoschu/test-a:${APP_VERSION}
docker push thoschu/test-a:latest
#docker images -a | grep "thoschu/test" | awk '{print $3}' | xargs docker rmi
docker rmi thoschu/test-a:${APP_VERSION} thoschu/test-a:latest
docker logout
