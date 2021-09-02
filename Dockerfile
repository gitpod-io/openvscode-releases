FROM ubuntu:18.04
RUN apt update
RUN apt install -y git wget

ARG SERVER_VERSION=v1.59.0
WORKDIR /home/
# Downloading the latest VSC Server release
RUN wget https://github.com/gitpod-io/vscode-releases/releases/download/${SERVER_VERSION}/code-web-server-${SERVER_VERSION}-linux-x64.tar.gz

# Extracting the release archive
RUN tar -xzf code-web-server-${SERVER_VERSION}-linux-x64.tar.gz
WORKDIR /home/code-web-server-${SERVER_VERSION}-linux-x64

# Creating the user and usergroup
RUN adduser vscode-server && \
    usermod -a -G vscode-server vscode-server

RUN chmod g+rw /home && \
    mkdir -p /home/vscode && \
    mkdir -p /home/workspace && \
    chown -R vscode-server:vscode-server /home/workspace && \
    chown -R vscode-server:vscode-server /home/vscode && \
    chown -R vscode-server:vscode-server /home/code-web-server-${SERVER_VERSION}-linux-x64;

USER vscode-server

WORKDIR /home/workspace/
ENV HOME /home/workspace/

EXPOSE 3000
ENV USE_LOCAL_GIT true
ENV SERVER_VERSION=${SERVER_VERSION}

ENTRYPOINT /home/code-web-server-$SERVER_VERSION-linux-x64/startup.sh