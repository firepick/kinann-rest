const Kinann = require("kinann");
const pkg = require("../package.json");
var rb = require("rest-bundle");

(function(exports) {
    class KinannRest extends rb.RestBundle {
        constructor(name="kinann", options = {}) {
            super(name, options);
        }

        get handlers() { return [
            new rb.ResourceMethod("get", "identity", this.getIdentity),
        ]}

        getIdentity(req, res, next) {
            return {
                name: pkg.name,
                version: pkg.version,
            }
        }

    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));
