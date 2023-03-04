FROM node:16-alpine as all-deps

RUN npm install -g npm@8

EXPOSE 3000
USER node
WORKDIR /home/node/

COPY --chown=node ./package* /home/node/

RUN npm clean-install && \
  npm cache clean --force

COPY --chown=node . /home/node/

RUN npm run build

FROM node:16-alpine

RUN npm install -g npm@8

EXPOSE 3000
USER node
WORKDIR /home/node/

ARG arg_SERVICE_NAME
ARG arg_BUILD_NUMBER
ARG arg_BRANCH
ENV SERVICE_NAME=$arg_SERVICE_NAME
ENV BUILD_NUMBER=$arg_BUILD_NUMBER
ENV BRANCH=$arg_BRANCH
ENV NO_COLOR='true'

COPY --from=all-deps --chown=node /home/node/package*.json /home/node/

RUN npm set-script prepare "" && \
    npm clean-install --production && \
    npm cache clean --force

RUN ln -s /config/${SERVICE_NAME}-service.ini /home/node/.env
COPY --from=all-deps --chown=node /home/node/dist/ /home/node/dist/

CMD npm run start:prod
