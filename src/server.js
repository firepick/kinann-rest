var timeLaunch = new Date();
//const Logger = require("../www/js/shared/Logger");
//Logger.start("server starting");
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var parser = bodyParser.json();
var __appdir = path.join(__dirname, "../www");

const KinannRest = require("./kinann-rest");

//var JsonUtil = require("../www/js/shared/JsonUtil");

function help() {
    console.log("HELP\t: TBD");
}

var pkg = JSON.parse(fs.readFileSync("package.json"));
var serviceOptions = {
    timeLaunch: timeLaunch,
};

process.argv.forEach(function(val, index, array) {
    serviceOptions.verbose && console.log("iNFO\t: server: argv[" + index + "] ", val);
    if (val === "--help" || val === "-h") {
        help();
        process.exit(0);
    } else if (val === "--verbose" ) {
        serviceOptions.verbose = true;
    } else if (index > 1) {
        throw new Error("unknown argument:" + val);
    }
});

//express.static.mime.define({
    //'application/json': ['firestep', 'position']
//});

app.use(parser);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.locals.msStart = new Date();
    if (req.method === "GET") {
        serviceOptions.verbose && console.log("HTTP\t:", req.method, req.url);
    } else if (req.method === "POST") {
        serviceOptions.verbose && console.log("HTTP\t:", req.method, req.url);
    } else {
        //console.log("HTTP\t:", req.method, req.url, "<=", JsonUtil.summarize(req.body, (serviceOptions.verbose ? null : 2)));
    }
    next();
});

function log_http(req, res, status, result) {
    (serviceOptions.verbose || req.method !== "GET") &&
    console.log("HTTP\t:", req.method, req.url, Math.round(new Date() - res.locals.msStart) + "ms=>" + status, result);
}

function respond_http(req, res, status, result) {
    res.status(status);
    if (status >= 500) {
        if (result instanceof Error) {
            result = {
                error: result.message,
            }
        } else {
            result = {
                error: result
            };
        }
        console.log(result);
    }
    res.send(result);
    log_http(req, res, status, result);
}

function processHttp(req, res, handler, next) {
    new Promise(function(resolve, reject) {
        handler(resolve, reject);
    }).then(function(result) {
        respond_http(req, res, 200, result);
    }).catch(function(err) {
        console.log("WARN\t: server: Caught exception:", err);
        console.log(err.stack);
        respond_http(req, res, 500, err.message);
    });
    next && next('route');
}

function processHttpSync(req, res, handlerOrData, next) {
    var httpMethod = req.method;
    var result = handlerOrData;
    var status = 200;
    if (typeof handlerOrData === "function") {
        try {
            result = handlerOrData();
            if (result instanceof Error) {
                status = 404;
                result = result.message;
            }
        } catch (e) {
            console.error("WARN\t: server: Caught exception:", e);
            console.error(e.stack);
            status = 500;
            result = e.message;
        }
    }
    respond_http(req, res, status, result);
    next && next('route');
}

function invokeService(service, cb) {
    return function(req, res, next) {
        if (service.isAvailable()) {
            cb(req, res, next);
        } else {
            respond_http(req, res, 503, service.constructor.name + "unavailable");
        }
    }
}

///////////// REST /firenodejs
//var dirs = ['bootstrap', 'html', 'img', 'css', 'js', 'lib', 'partials', 'svg'];
//for (var i = 0; i < dirs.length; i++) {
    //var urlpath = '/firenodejs/' + dirs[i];
    //var filepath = path.join(__appdir, dirs[i]);
    //app.use(urlpath, express.static(filepath));
    //serviceOptions.verbose && console.log("HTTP\t: firenodejs mapping urlpath:" + urlpath + " to:" + filepath);
//}
//app.use('/var', express.static('/var/firenodejs'));
//app.use('/cp', express.static('node_modules/angular-bootstrap-colorpicker'));
//app.use('/html', express.static(path.join(__appdir, 'html')));
//app.use('/lib', express.static(path.join(__appdir, 'lib')));
//app.use('/node', express.static(path.join(__dirname, '../node_modules')));
//app.use('/css', express.static(path.join(__appdir, 'css')));
//app.use('/js', express.static(path.join(__appdir, 'js')));
//app.use('/img', express.static(path.join(__appdir, 'img')));
//app.use('/partials', express.static(path.join(__appdir, 'partials')));

var kinannService = new KinannRest(app, serviceOptions);


/////////// POST Process

app.all('*', function(req, res, next) {
    next();
});

/////////// Startup

process.on('uncaughtException', function(error) {
    console.log("HTTP\t: firenodejs UNCAUGHT EXCEPTION:" + error);
    throw error;
});

function onListen(port, data) {
    serviceOptions.port = port;
    var msg = ' listening on HTTP port ' + port;
    console.log("HTTP\t:" + msg);
}

var listener = app.listen(80, (data) => onListen(80, data));
listener.on('error', function(error) {
    if (error.code === "EACCES") {
        serviceOptions.verbose && console.warn("INFO\t: server: kinann-rest insufficient user privilege for port 80 (trying 8080) ...");
        listener = app.listen(8080, (data) => onListen(8080, data));
    } else {
        console.error("HTTP\t: server: firenodejs listener ERROR:" + error);
        throw error;
    }
});

process.on('exit', (data) => console.log("END\t: server: kinann-rest exit with code:" + data));
