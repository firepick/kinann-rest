#!/usr/bin/env node

const app = require('express')();

const KinannRest = require("../src/kinann-rest");
var bundleName = "kinann-rest";
var kinannService = new KinannRest(bundleName);
kinannService.bindExpress(app);

function onListen(port, data) {
    var msg = "/" + bundleName + ' listening on HTTP port ' + port;
    console.log("HTTP\t: " + msg);
}
var listener = app.listen(80, (data) => onListen(80, data));
listener.on('error', function(error) {
    if (error.code === "EACCES") {
        console.warn("INFO\t: insufficient user privilege for port 80 (trying 8080) ...");
        listener = app.listen(8080, (data) => onListen(8080, data));
    } else {
        throw error;
    }
});
