const Kinann = require("kinann");
var version = require("../package.json").version;
var RestBundle = require("./rest-bundle");

(function(exports) {
    class KinannRest extends RestBundle {
        constructor(options = {}) {
            super("/kinann-rest", options);
        }

        get handlers() {
            return [{
                path: "/version",
                handler: this.getVersion,
                mime: "text/html",
            }, {
                path: "/error",
                handler: this.getError,
            }]
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
