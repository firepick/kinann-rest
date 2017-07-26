(function(exports) {
    ///////////////// class ////////////////////
    var pkg = {
        RestServer: require("./src/rest-server"),
    };

    module.exports = exports.RestServer = pkg;
})(typeof exports === "object" ? exports : (exports = {}));

