const Switchbot = require('node-switchbot');
const switchbot = new Switchbot();

const Wyze = require('wyze-node');

const {vpd, rh} = require('./utils');

const options = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const wyze = new Wyze(options);

/**
 * Turn off named device
* @param {string} name
*/
async function off(name) {
  console.log(`Turn off ${name} ...`);

  const device = await wyze.getDeviceByName(name);
  const result = await wyze.turnOff(device);
  console.log(result);
  console.log('Done.');
}

/**
 * Turn on named device
* @param {string} name
*/
async function on(name) {
  console.log(`Turn on ${name} ...`);

  const device = await wyze.getDeviceByName(name);
  const result = await wyze.turnOn(device);
  console.log(result);
  console.log('Done.');
}

let initialized = false;
const names = ['blower', 'lamp'];
const devices = new Map;
let VPD; let T; let DELTA; let INTERVAL; let RH;

async function init() {
  console.log('INIT ...');

  return wyze.getDeviceList().then((dlist) => {
    dlist.forEach((device) => {
      names.forEach((name) => {
        if (device.nickname.match(new RegExp(name, 'i'))) {
          if (!devices.has(name)) {
            devices.set(name, []);
          }
          devices.get(name).push(device.nickname);
        }
      });
    });


    VPD = parseFloat(process.env.VPD) || 1.0;
    T = parseFloat(process.env.T) || 22.0;
    DELTA = parseFloat(process.env.DELTA) || 1.0;
    INTERVAL = parseInt(process.env.interval) || 30000;
    console.log(`Set VPD ${VPD}`);
    console.log(`Set T ${T}`);
    console.log(`Set DELTA ${DELTA}`);
    console.log(`Set INTERVAL ${INTERVAL}`);
    RH = rh(VPD, T);
    console.log(`Set RH ${RH}`);

    return switchbot.discover().then((devices) => {
console.log(devices);
      const device = devices[0];
      console.log('Found it!');
      console.log(device);

      initialized = true;
console.log('Done.');
    }).catch((error) => {
      console.error(error);
    });
  });
}

async function app() {
  if (!initialized) {
    await init();
  }

  console.log(devices);

  switchbot.discover({model: 'T', quick: false}).then((devices) => {
    const device = devices[0];
    console.log('Found it!');
    console.log(device);
    const t = device.temperature.c;
    const rh = device.humidity / 100;
    console.log(`Reading ${t} and ${rh}`);
    const vpd = vpd(t - DELTA, t, rh);

    if (vpd < VPD) {
      if (t < T) {
        off('blower');
        on('heater');
      }

      if (rh > RH) {
        // dehumidifiers on
        // AC unit dehumidify on
      }
    } else {
      if (t > T) {
        // blowers on
        // heaters off
        // AC unit cool
      }

      if (rh < RH) {
        // dehumidifiers off
        // AC unit dehumidify off
      }
    };
  }).catch((error) => {
    console.error(error);
  });

  setTimeout(app, INTERVAL);
}

setTimeout(app, 0);
