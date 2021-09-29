# OpenVSCode Server releases

This repo is only to produce releases for [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server).

### Custom Environment
- If you want to add dependencies to the image, it is also possible to customize this Docker image in the following format:
	```Dockerfile
	
	FROM gitpod/openvscode-server:latest
	USER root # to get permissions to install packages and such
	RUN # the installation process for software needed
	USER vscode-server # to restore permissions for the web interface
	
	```
