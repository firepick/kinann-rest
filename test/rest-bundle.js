(typeof describe === 'function') && describe("RestBundle", function() {
    var should = require("should");
    var RestBundle = require("../src/rest-bundle");
    var ResourceMethod = require("../src/resource-method");

    class SimpleBundle extends RestBundle {
        constructor(name="simple",options = {}) {
            super(name, options);
            Object.defineProperty(this, "handlers", {
                value: [
                    new ResourceMethod("get", "hello", this.getHello, "text/html"),
                    new ResourceMethod("post", "hello", this.onDie),
                ]
            });

        }

        getHello(req, res) {
            return "hello";
        }

        onDie(req, res) {
            throw new Error("I died");
        }
    }

    class MockExpress {
        constructor() {
            this.testGET = {};
            this.testPOST = {};
        }
        get(path, cb) {
            this.testGET[path] = cb;
        }
        post(path, cb) {
            this.testPOST[path] = cb;
        }
        assertHandler(method, path) {
            method === "get" && this.testGET.should.properties([path]);
            method === "post" && this.testPOST.should.properties([path]);
        }
    }

    class MockResponse {
        constructor(status=200) {
            this.status(status);
        }
        status(code) {
            this.statusCode = code;
        }
        type(value) {
            this.testType = value;
        }
        send(data) {
            this.testData = data;
        }
    }

    it("bindHandlers() binds reource bulde paths tp express resource handlers", function() {
        var app = new MockExpress();
        var simple = new SimpleBundle("simple"); // create a resource bundle with root path
        simple.bindHandlers(app);
        app.assertHandler("get", "/simple/hello");
        app.assertHandler("post", "/simple/hello");
    })
    it("RestBundle generates HTTP200 response", function(done) {
        var app = new MockExpress();
        var simple = new SimpleBundle("simple");
        simple.bindHandlers(app);
        var req = {};
        var res = new MockResponse();
        var iNext = 0;
        function next() {
            iNext++;
        }
        var promise = app.testGET["/simple/hello"](req, res, next);
        should(promise).instanceOf(Promise);
        promise.then((data) => {
            res.should.properties({
                statusCode: 200,
                testType: "text/html",
                testData: "hello",
            });
            data.should.equal("hello");
            iNext.should.equal(1);
            done();
        });
    })
    it("RestBundle generates HTTP500 response", function(done) {
        var app = new MockExpress();
        var simple = new SimpleBundle();
        simple.bindHandlers(app);
        var req = {};
        var res = new MockResponse();
        var iNext = 0;
        function next() {
            iNext++;
        }
        var promise = app.testPOST["/simple/hello"](req, res, next);
        should(promise).instanceOf(Promise);
        promise.then(
            (data) => should.fail("should not happen"),
            (err) => {
                res.should.properties({
                    statusCode: 500,
                    testType: "application/json",
                    testData: {
                        error: "I died"
                    }
                });
                iNext.should.equal(1);
                done();
        });
    })
})
