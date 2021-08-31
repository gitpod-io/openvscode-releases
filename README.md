# vscode releases

## Getting started

### Installation instructions

You can download the latest release for your platform from the [GitHub release page](https://github.com/gitpod-io/vscode/releases/latest).

### Starting the VS Code Server

#### Linux & macOS

First, untar the downloaded archive.

```bash
tar -xzf code-web-server-v*.tar.gz

```

Then, run the web server.

```bash
cd code-web-server-v*-x64
./startup.sh
```

### Docker

#### Building the image
```bash
docker build -t vscode .
```

#### Starting the container
```bash
docker run -d -p  3000:3000 vscode
```

After this, visit [localhost:3000](http://localhost:3000).