# nodescan
A web based network scanner made in javascript

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)


## Install

    npm install -g

### Develop

    git clone https://github.com/krishpranav/nodescan.git
    cd nodescan
    npm install
    npm link

### OSX

    brew install arp-scan

### Linux

    sudo apt-get install arp-scan

## Usage

    ➜ nodescan git:(master) nodescan -h

      Usage: nodescan nodescan [options]

      Local network scanner with web interface

      Options:

        -h, --help              output usage information
        -V, --version           output the version number
        -d, --dev [interface]   network interface to use for scan, default: en1
        -l, --loc [location]    save file location, default location: ~
        -p, --port <port>       Http server port number, default: 8888
        -u, --update [seconds]  update time for arp-scan, default: 60 sec


## Setup

For RPi, install this in `/etc/systemd/system/nodescan.service`, this will ensure it runs at start up.

    [Service]
    ExecStart=/usr/local/bin/nodescan -d eth0 -l /var/run
    Restart=always
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=nodescan
    User=root
    Group=root
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target

Then do:

    sudo systemctl enable nodescan.service
    sudo systemctl start nodescan.service

Now use a browser to go to `<your rpi>:8888` and see the results.


You can also use `sudo systemctl start|stop|status nodescan.service` to start, stop, or find the current status of the server.
