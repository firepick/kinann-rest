(function(exports) {
    class RestBundle {
        constructor(service, options = {}) {
            if (service == null) {
                throw new Error("service path is required");
            }
            this.service = service;
            this.$onSuccess = options.onSuccess || RestBundle.onSuccess;
            this.$onFail = options.onFail || RestBundle.onFail;
        }

        get handlers() {
            throw new Error("virtual method must be implemented");
        }

        static onSuccess(req, res, data, next, mime) {
            res.status(200);
            res.type(mime);
            res.send(data);
            next && next('route');
        }

        static onFail(req, res, err, next) {
            res.status(500);
            res.type("application/json");
            var data = {
                error: err.message,
            }
            res.send(data);
            next && next('route');
        }

        process(req, res, next, handler, mime) {
            var promise = new Promise((resolve, reject) => resolve(handler(req, res)));
            promise.then(
                (data) => this.$onSuccess(req, res, data, next, mime),
                (err) => this.$onFail(req, res, err, next)
            );
            return promise;
        }

        bindHandlers(app, handlers = this.handlers) {
            handlers.forEach((resource) => {
                var mime = resource.mime || "application/json";
                var method = resource.method || "GET";
                if (method === "GET") {
                    app.get(this.service + resource.path, (req, res, next) =>
                        this.process(req, res, next, resource.handler, mime))
                } else if (method === "POST") {
                    app.post(this.service + resource.path, (req, res, next) =>
                        this.process(req, res, next, resource.handler))
                }
            });
        }
    }

    module.exports = exports.RestBundle = RestBundle;
})(typeof exports === "object" ? exports : (exports = {}));
