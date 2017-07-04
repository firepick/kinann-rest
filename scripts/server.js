#!/usr/bin/env node

const path = require("path");
const express = require('express');
const app = module.exports = express();
const rb = require("rest-bundle");
const KinannRest = require("../src/kinann-rest");
const kinann = require("kinann");
const MockSerial = kinann.serial.MockSerial;
const MockFireStep = kinann.serial.MockFireStep;
const FireStepDriver = kinann.serial.FireStepDriver;
const winston = require("winston");

// ensure argv is actually for script instead of mocha
var argv = process.argv[1].match(__filename) && process.argv || [];

// set up application
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Access-Control-Allow-Headers");
    next();
});
app.use("/", express.static(path.join(__dirname, "../src/ui")));
app.use("/dist", express.static(path.join(__dirname, "../dist")));

app.locals.asyncOnReady = []; // list of async blocks waiting on app setup completion
let async = function*() { 
    try {
        // define RestBundles
        var restBundles = app.locals.restBundles = [];
        var services = argv.filter((a, i) => i>1 && a[0]!=='-' && a!=="test").concat("test");
        for (var iService = 0; iService < services.length; iService++) {
            var serviceName = services[iService];
            var serialDriver = new FireStepDriver({ allowMock: true, });
            var sp = yield serialDriver.open().then(r=>async.next(r)).catch(e=>async.throw(e));
            winston.info("KinannRest", serviceName, "connected to", sp.path);
            restBundles.push(new KinannRest(serviceName, { serialDriver }));
        }

        // declare ports
        var isTesting = module.parent != null && false;
        var testports = new Array(100).fill(null).map((a,i) => 3000 + i); // lots of ports for mocha -w
        var ports = isTesting ? testports : [80,8080];

        // create http and socket servers
        var rbServer = app.locals.rbServer = new rb.RbServer();
        rbServer.listen(app, restBundles, ports);

        winston.debug("firing asyncOnReady event");
        app.locals.asyncOnReady.forEach(async => async.next(app)); // notify waiting async blocks
    } catch (err) {
        winston.error("server.js:", err);
        async.throw(err);
    }
}();
async.next();
