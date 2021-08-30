ARG NODE_VERSION=14.17.5
FROM node:${NODE_VERSION}-alpine
RUN apk add --no-cache make pkgconfig gcc g++ python libx11-dev libxkbfile-dev libsecret-dev git
ARG version=latest
WORKDIR /home/
RUN git clone https://github.com/gitpod-io/vscode --depth=1 --branch web-server
WORKDIR /home/vscode
RUN yarn --pure-lockfile && \
    yarn gulp server-min;

RUN ls ..
RUN addgroup vscode-server && \
    adduser -G vscode-server -s /bin/sh -D vscode-server;
RUN chmod g+rw /home && \
    mkdir -p /home/vscode && \
    chown -R vscode-server:vscode-server /home/vscode && \
    chown -R vscode-server:vscode-server /home/vscode;
RUN apk add --no-cache git openssh bash libsecret
ENV HOME /home/vscode
EXPOSE 3000
ENV USE_LOCAL_GIT true
USER vscode-server
ENTRYPOINT [ "node", "/home/server-pkg/out/server.js" ]