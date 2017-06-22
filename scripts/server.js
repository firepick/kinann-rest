#!/usr/bin/env node

const path = require("path");
const express = require('express');
const app = module.exports = express();
const rb = require("rest-bundle");
const KinannRest = require("../src/kinann-rest");
const MockSerial = require("kinann").serial.MockSerial;
const MockFireStep = require("kinann").serial.MockFireStep;
const FireStepDriver = require("kinann").serial.FireStepDriver;
const winston = require("winston");

app.locals.asyncOnReady = []; // list of async blocks waiting on app setup completion
let async = function*() {
    function asyncPromise(p) { p.then(r=>async.next(r)).catch(e=>async.throw(e)); }

    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Access-Control-Allow-Headers");

        next();
    });
    app.use("/", express.static(path.join(__dirname, "../src/ui")));
    app.use("/dist", express.static(path.join(__dirname, "../dist")));

    var services = ["test"]; // for developer app, we always want a test service
    process.argv[1].match(__filename) && process.argv.forEach((val, index) => {
        (index > 1 && val[0] !== '-' && val !== "test") && services.push(val);
    });
    winston.info("creating RestBundles:", services.join(", "));
    var restBundles = [];
    for (var iService = 0; iService < services.length; iService++) {
        var serviceName = services[iService];
        var serialDriver = new FireStepDriver({
            allowMock: true,
        });
        var sp = yield serialDriver.open().then(r=>async.next(r)).catch(err=>async.throw(err));
        winston.info("KinannRest", serviceName, "connected to", sp.path);
        var kr = new KinannRest(serviceName, { serialDriver });
        kr.bindExpress(app);
        restBundles.push(kr);
    }

    if (module.parent) {
        app.restService = restBundles[0];  // supertest
    } else {
        var ports = [80, 8080];
        var listener = ports.reduce( (listener, port) => {
            return listener.listening && listener
            || app.listen(port).on('error', function(error) {
                if (error.code !== "EACCES") { throw error; }
            })
        }, {});
        var port = listener.address().port;
        winston.info('Node.js http.Server listening on port:', port);
        var rbws = new rb.RestBundle.RbWebSocket(restBundles, listener, {
            pushStateInterval: 5000, // Background pushState handles state changes that were not pushed directly
        });
    }

    app.locals.asyncOnReady.forEach(async => async.next(app)); // notify waiting async blocks
}();
async.next();
console.log("scripts/server...");
