# Deploying Visual Studio Code Server to Digital Ocean

## Creating the Droplet

First we need to create the Virtual Machine to host our server on. If you don't have it already, you can just start with [our template](https://cloud.digitalocean.com/droplets/new?use_case=droplet&i=59c3b0&fleetUuid=a8fdcc26-2bf0-449d-8113-e458327192fe&distro=ubuntu&distroImage=ubuntu-20-04-x64&size=s-1vcpu-1gb-amd&region=fra1&options=ipv6) and after that just change a couple of settings, explained below.

- We need to set a password or add an SSH key. For demonstration purposes, it's easier to use a password.
- We need to do is to check the checkbox <kbd>User data</kbd> and add the following script to the textfield below:

## Initial setup

- First things first, you need to turn on the Droplet by selecting it in the dashboard and toggling the switch on the top right of the page.
- Then, you need to copy the Droplet's IP address, available on the same page in the top bar. If you are unsure whether to copy the **ipv4** or **ipv6** address, select **ipv4**.
- Now we can connect to our droplet via SSH, which you can do straight from your terminal by executing this command (you will need to replace `DROPLET_IP` with the actual address you copied in the previous step):

```
ssh root@DROPLET_IP
```

- Now, type in the password you chose during the configuration and we're in!

### Downloading Visual Studio Code Server

Downloading Visual Studio Code Server is as easy as pie. We can download it by executing the following commands:

```
wget https://github.com/gitpod-io/vscode-releases/releases/download/v1.59.0/code-web-server-v1.59.0-linux-x64.tar.gz -O code-server.tar.gz
tar -xzf code-server.tar.gz
```

Now we can `cd` into the VSC Server folder and execute the startup script like so:

```
cd code-web-server-v*-x64
./server.sh
```

> Gotcha: If you close the SSH session, the server will stop as well. To avoid this, you can run the server script in the background with the command shown below. If you want to do things like kill the process or bring it back to the foreground, refer to [Run a Linux Command in the Background](https://linuxize.com/post/how-to-run-linux-commands-in-background/#run-a-linux-command-in-the-background) or use a multiplexer such as [tmux](https://en.wikipedia.org/wiki/Tmux) [[tmux - a very simple beginner's guide](https://www.ocf.berkeley.edu/~ckuehl/tmux/)].

```
./server.sh >/dev/null 2>&1 &
```

We're all set! You can now access your IDE at `http://<your-droplet-ip>:3000`.

## Further steps

### Running Visual Studio Code Server on startup

If you want to run the server on boot, you can add this to your Crontab file (`crontab -e`):

```
@reboot /root/code-web-server-v1.59.0-linux-x64/server.sh
```

### Adding a custom domain

You can follow the official [DNS Quickstart](https://docs.digitalocean.com/products/networking/dns/quickstart/) guide for setting up a custom domain with your Droplet.

### Securing the Droplet

There is an awesome video by Mason Egger called [Securing Your Droplet](https://youtu.be/L8e_eAm4fFM), which explains some key steps for hardening the security of the Droplet.
