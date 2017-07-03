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

app.locals.asyncOnReady = []; // list of async blocks waiting on app setup completion
let async = function*() { 
    try {
        app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Access-Control-Allow-Headers");

            next();
        });
        app.use("/", express.static(path.join(__dirname, "../src/ui")));
        app.use("/dist", express.static(path.join(__dirname, "../dist")));

        var restBundles = [
            new rb.RbServer(),          // [0] server singleton
        ];
        var services = ["test"];
        process.argv[1].match(__filename) && process.argv.forEach((val, index) => {
            if (index > 1 && val[0] !== '-' && val !== "test") {
                services.push(val);
            }
        });
        for (var iService = 0; iService < services.length; iService++) {
            var serviceName = services[iService];
            var serialDriver = new FireStepDriver({ allowMock: true, });
            var sp = yield serialDriver.open().then(r=>async.next(r)).catch(e=>async.throw(e));
            winston.info("KinannRest", serviceName, "connected to", sp.path);
            var kr = new KinannRest(serviceName, { serialDriver });
            restBundles.push(kr);
        }
        restBundles.forEach(rb => rb.bindExpress(app));

        if (module.parent) {
            winston.info("server.js: launching in supertest mode");
            app.restService = restBundles[1];  // supertest
            var ports = new Array(100).fill(null).map((a,i) => 3000 + i); // lots of ports for mocha -w
        } else {
            var ports = [80, 8080];
            winston.debug("launching web server...");
        }
        var listener = ports.reduce( (listener, port) => {
            return listener.listening && listener
            || app.listen(port).on('error', function(error) {
                if (error.code === "EACCES") { 
                    // 80 requires root
                } else if (error.code === "EADDRINUSE" ) {
                    // supertest doesn't release port
                } else { 
                    throw error; 
                }
            })
        }, {});
        app.locals.webSocket = new rb.RbWebSocketServer(restBundles, listener, {
            pushStateMillis: 1000, // Background pushState handles state changes that were not pushed directly
        });

        winston.debug("firing asyncOnReady event");
        app.locals.asyncOnReady.forEach(async => async.next(app)); // notify waiting async blocks
    } catch (err) {
        winston.error("server.js:", err);
        async.throw(err);
    }
}();
async.next();
