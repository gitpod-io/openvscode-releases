# Deploying an OpenVSCode Server to Render

## Creating the server with one click

If you want to use Render to host your OpenVSCode server, simply click the button below:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://dashboard.render.com/login?next=/iac/new?repo=https://github.com/render-examples/gitpod-vscode-example)

After that, create a name for the service group (could be `OpenVSCode Server`, for example), and click <kbd>Apply</kbd>.

After Render does its magic, we will see our server listed in the <kbd>Services</kbd> section of the Dashboard. In there, we can see the URL of our server, from which we can access it.

![image showing where the URL can be found](https://user-images.githubusercontent.com/29888641/133103443-c20a6eab-7d35-46d2-80b0-107dd9237870.png)

## Creating the server manually

- [Connect your GitHub account to your Render account](https://render.com/docs/github).
- Clone this repo.
- Create a new web service using this repo and the following parameters:
  - Environment: Docker
  - Advanced > Add Environment Variable
    - key: SERVER_VERSION
    - value: v1.59.0
  - Advanced > Add Disk
    - Name: data
    - Mount Path: /home/workspace
- Watch your OpenVSCode Server deploy, and then log in at the public URL listed below your web service name.
