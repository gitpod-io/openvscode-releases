FROM ubuntu:18.04
RUN apt update && \
    apt install -y git wget && \
    rm -rf /var/lib/apt/lists/*

ARG RELEASE_TAG

WORKDIR /home/

# Downloading the latest VSC Server release and extracting the release archive
RUN wget https://github.com/gitpod-io/openvscode-server/releases/download/${RELEASE_TAG}/${RELEASE_TAG}-linux-x64.tar.gz && \
    tar -xzf ${RELEASE_TAG}-linux-x64.tar.gz && \
    rm -f ${RELEASE_TAG}-linux-x64.tar.gz

# Creating the user and usergroup
RUN adduser vscode-server && \
    usermod -a -G vscode-server vscode-server

RUN chmod g+rw /home && \
    mkdir -p /home/vscode && \
    mkdir -p /home/workspace && \
    chown -R vscode-server:vscode-server /home/workspace && \
    chown -R vscode-server:vscode-server /home/vscode && \
    chown -R vscode-server:vscode-server /home/${RELEASE_TAG}-linux-x64;

USER vscode-server

WORKDIR /home/workspace/

ENV HOME=/home/workspace
ENV EDITOR=code
ENV VISUAL=code
ENV GIT_EDITOR="code --wait"
ENV OPENVSCODE_SERVER_ROOT=/home/${RELEASE_TAG}-linux-x64

EXPOSE 3000

ENTRYPOINT ${OPENVSCODE_SERVER_ROOT}/server.sh
