#!/usr/bin/env node

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const parser = bodyParser.json();
const RestBundle = require("../src/rest-bundle");
const KinannRest = require("../src/kinann-rest");

function help() {
    console.log("HELP\t: TBD");
}

var bundleOptions = {
    onFail: (req, res, err, next) => { 
        bundleOptions.verbose && console.log("HTTP\t: ERROR", err); 
        RestBundle.onFail(req, res, err, next);
    }
};

process.argv.forEach(function(val, index, array) {
    bundleOptions.verbose && console.log("iNFO\t: server: argv[" + index + "] ", val);
    if (val === "--help" || val === "-h") {
        help();
        process.exit(0);
    } else if (val === "--verbose") {
        bundleOptions.verbose = true;
    } else if (index > 1) {
        throw new Error("unknown argument:" + val);
    }
});

app.use(parser);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.locals.msStart = new Date();
    if (req.method === "GET") {
        bundleOptions.verbose && console.log("HTTP\t:", req.method, req.url);
    } else if (req.method === "POST") {
        bundleOptions.verbose && console.log("HTTP\t:", req.method, req.url);
    } else {
        //console.log("HTTP\t:", req.method, req.url, "<=", JsonUtil.summarize(req.body, (bundleOptions.verbose ? null : 2)));
    }
    next();
});

var kinannService = new KinannRest(bundleOptions);
kinannService.bindExpress(app);

/////////// Startup

function onListen(port, data) {
    var msg = ' listening on HTTP port ' + port;
    console.log("HTTP\t:" + msg);
}

var listener = app.listen(80, (data) => onListen(80, data));
listener.on('error', function(error) {
    if (error.code === "EACCES") {
        bundleOptions.verbose && console.warn("INFO\t: insufficient user privilege for port 80 (trying 8080) ...");
        listener = app.listen(8080, (data) => onListen(8080, data));
    } else {
        console.error("HTTP\t: server: firenodejs listener ERROR:" + error);
        throw error;
    }
});

process.on('exit', (data) => console.log("END\t: server: kinann-rest exit with code:" + data));
