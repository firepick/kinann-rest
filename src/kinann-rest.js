const Kinann = require("kinann");
var version = require("../package.json").version;

//////////// REST /position
//app.post('/position/test', function(req, res, next) {
    //console.log("HTTP\t: POST " + req.url + " <= " + JSON.stringify(req.body));
    //position.test(res, req.body);
    //log_http(req, res, 200, "");
//});
//app.get('/position/model', function(req, res, next) {
    //processHttpSync(req, res, function() {
        //return position.syncModel();
    //}, next);
//});
//app.get('/position/location', function(req, res, next) {
    //processHttpSync(req, res, function() {
        //return position.getLocation();
    //}, next);
//});
//app.get('/position/history', function(req, res, next) {
    //processHttpSync(req, res, function() {
        //return position.history();
    //}, next);
//});
//app.post("/position/home*", parser, invokeService(position, (req, res, next) => {
    //var tokens = req.url.split("/");
    //var axis = tokens[tokens.length - 1];
    //var promise = axis === "home" ? position.homeAll(req.body) : position.homeAxis(req.body, axis);
    //promise.then(
        //data => respond_http(req, res, 200, data),
        //err => respond_http(req, res, 500, err)
    //);
//}));
//app.post("/position/move", parser, invokeService(position, (req, res, next) => {
    //position.move(req.body).then(
        //data => respond_http(req, res, 200, data),
        //err => respond_http(req, res, 500, err)
    //);
//}));
//app.post("/position/reset", parser, function(req, res, next) {
    //if (position.model.available) {
        //position.reset(req.body, function(data) {
            //respond_http(req, res, 200, data);
        //});
    //} else {
        //respond_http(req, res, 501, "/position unavailable");
    //}
//});
//app.post("/position", parser, function(req, res, next) {
    //if (position.model.available) {
        //position.send(req.body, function(data) {
            //respond_http(req, res, 200, data);
        //});
    //} else {
        //respond_http(req, res, 501, "/position unavailable");
    //}
//});

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
    //log_http(req, res, status, result);
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
    next && next('route');
}

(function (exports) {
    class KinannRest {
        constructor(app, options = {}) {
            this.version = options.version || {};
            this.service = options.service || "/kinann-rest";
            var http_get_handlers = {
                "/version": this.getVersion,
                "/error": this.getError,
            };
            Object.keys(http_get_handlers).forEach((name) => 
                app.get(this.service + name, (req, res, next) => {
                    processHttpSync(req, res, http_get_handlers[name](req, res), next);
                })
            );
        }

        getError(req, res, next) {
            throw new Error("I died");
        }

        getVersion(req, res, next) {
            return "kinann-rest " + version;
        }
    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));
