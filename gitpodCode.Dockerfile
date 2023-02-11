# FROM alpine:3.16
FROM scratch

# copy static web resources in first layer to serve from blobserve
COPY --chown=33333:33333 vscode-web /ide/
COPY --chown=33333:33333 vscode-reh-linux-x64 /ide/

ENV GITPOD_ENV_APPEND_PATH=/ide/bin/remote-cli:

# editor config
ENV GITPOD_ENV_SET_EDITOR=/ide/bin/remote-cli/gitpod-code
ENV GITPOD_ENV_SET_VISUAL="$GITPOD_ENV_SET_EDITOR"
ENV GITPOD_ENV_SET_GP_OPEN_EDITOR="$GITPOD_ENV_SET_EDITOR"
ENV GITPOD_ENV_SET_GIT_EDITOR="$GITPOD_ENV_SET_EDITOR --wait"
ENV GITPOD_ENV_SET_GP_PREVIEW_BROWSER="/ide/bin/remote-cli/gitpod-code --preview"
ENV GITPOD_ENV_SET_GP_EXTERNAL_BROWSER="/ide/bin/remote-cli/gitpod-code --openExternal"
