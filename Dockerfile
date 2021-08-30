ARG NODE_VERSION=14.17.5

FROM node:${NODE_VERSION}-buster
RUN apt update
RUN apt install -y git wget

ARG version=latest
ARG SERVER_VERSION=v1.59.0
WORKDIR /home/
RUN wget https://github.com/gitpod-io/vscode-releases/releases/download/${SERVER_VERSION}/code-web-server-${SERVER_VERSION}-Linux-x64.tar.gz

RUN tar -xzf code-web-server-${SERVER_VERSION}-Linux-x64.tar.gz
WORKDIR /home/code-web-server-${SERVER_VERSION}-Linux-x64
RUN adduser vscode-server && \
    usermod -a -G vscode-server vscode-server
RUN chmod g+rw /home && \
    mkdir -p /home/vscode && \
    chown -R vscode-server:vscode-server /home/vscode && \
    chown -R vscode-server:vscode-server /home/vscode;
ENV HOME /home/vscode
EXPOSE 3000
ENV USE_LOCAL_GIT true

USER vscode-server

RUN ls server-pkg/out/
ENTRYPOINT node server-pkg/out/server.js