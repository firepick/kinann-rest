const RestBundle = require("../src/rest-bundle");
const ResourceMethod = RestBundle.ResourceMethod;

(function(exports) {

    // Define a RestBundle for a "hello" service
    class HelloBundle extends RestBundle {
        constructor(name="hello",options = {}) {
            super(name, options);
        }

        get handlers() {return [
            new ResourceMethod("get", "hello", this.getHello, "text/html"),
            new ResourceMethod("post", "hello", this.onDie),
        ]}

        getHello(req, res) {
            return "hello";
        }

        onDie(req, res) {
            throw new Error("goodbye");
        }
    }

    module.exports = exports.HelloBundle = HelloBundle;
})(typeof exports === "object" ? exports : (exports = {}));
