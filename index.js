(function(exports) {
    ///////////////// class ////////////////////
    var pkg = {
        KinannRest: require("./src/kinann-rest"),
    };

    module.exports = exports.KinannRest = pkg;
})(typeof exports === "object" ? exports : (exports = {}));

