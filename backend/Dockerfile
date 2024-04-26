FROM node:20-alpine as base
FROM base as all-deps

EXPOSE 3000
USER node
WORKDIR /home/node/

COPY --chown=node ./package* /home/node/

RUN npm clean-install && \
  npm cache clean --force

COPY --chown=node . /home/node/

RUN npm run build

FROM base

RUN npm install -g npm@9

EXPOSE 3000
USER node
WORKDIR /home/node/

ENV NO_COLOR='true'

COPY --from=all-deps --chown=node /home/node/package*.json /home/node/

RUN npm set-script prepare "" && \
    npm clean-install --production && \
    npm cache clean --force

COPY --from=all-deps --chown=node /home/node/dist/ /home/node/dist/

CMD npm run start:prod
