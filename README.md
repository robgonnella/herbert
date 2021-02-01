# Herbert

An environmental control system using BLE devices and Node.js

## Getting Started

Using Ubuntu 20.04 or Raspberry Pi OS Lite 5.4 2020-08-09

```
$ sudo apt-get update && sudo apt-get install git nodejs npm -y
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev -y
$ git clone https://github.com/metatooth/herbert.git
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Client Deployment

Using Raspberry Pi 3 Model A+ & Raspberry Pi OS Lite 5.4 2020-08-20

- Add device configuration to ~/herbert/config/production.json
- Install script and add to system defaults
- Start and check status

```
$ sudo cp scripts/herbert /etc/init.d/herbert
$ sudo update-rc.d herbert defaults
$ sudo /etc/init.d/herbert start
$ sudo /etc/init.d/herbert status
```

## License

Copyright 2021 Metatooth LLC. See the [LICENSE](LICENSE).
