const should = require("should");
const KinannRest = require("../src/kinann-rest");
const supertest = require('supertest');

(typeof describe === 'function') && describe("KinannRest", function() {

    var pkg = require("../package.json");
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }

    it(" GET /identity returns Kinann REST identity", function(done) {
        var app = require("../scripts/kinann-node.js");
        supertest(app).get("/kinann-rest/identity").expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            res.body.should.properties({
                name: pkg.name,
                package: "kinann-rest",
                version: pkg.version,
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    })
    it("GET /state returns DriveFrame state", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        supertest(app).get("/kinann-rest/state").expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, service.df.state);
            // drive frame state
            service.df.state.should.instanceOf(Array); 
            service.df.state.length.should.equal(6);
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("GET /position returns DriveFrame position", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        supertest(app).get("/kinann-rest/position").expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            res.body.should.properties({
                    motor: [0,0,0],
                    axis: [0,0,0],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("POST /position sets DriveFrame position in axis coordinates", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        var axis123 = {
            axis: [1,2,3],
        }
        supertest(app).post("/kinann-rest/position").send(axis123).expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                motor: [100,200,7680],
                axis: [1,2,3],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    })
    it("POST /position sets DriveFrame position in motor coordinates", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        var motor123 = {
            motor: [100,200,7680],
        }
        supertest(app).post("/kinann-rest/position").send(motor123).expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                motor: [100,200,7680],
                axis: [1,2,3],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("POST /position priority is: 1) axis, 2) motor", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        var ambiguous123 = {
            axis: [1,2,3],
            motor: [1,2,3],
        }
        supertest(app).post("/kinann-rest/position").send(ambiguous123).expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                motor: [100,200,7680],
                axis: [1,2,3],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("POST /position requires valid position", function(done) {
        var app = require("../scripts/kinann-node.js");
        var service = app.restService;
        supertest(app).post("/kinann-rest/position").send({here:42}).expect((res) => {
            res.statusCode.should.equal(500);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                error: 'unknown position:{"here":42}',
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("GET /ui returns index HTML", function(done) {
        var app = require("../scripts/kinann-node.js");

        supertest(app).get("/kinann-rest/ui").expect((res) => {
            res.statusCode.should.equal(302); // redirect
            res.headers["content-type"].should.match(/text/);
            res.headers["content-type"].should.match(/utf-8/);
            res.headers["location"].should.equal("/kinann-rest/ui/index-jit");
        }).end((err,res) => {if (err) throw err; });

        supertest(app).get("/kinann-rest/ui/index-jit").expect((res) => {
            res.statusCode.should.equal(200); 
            res.headers["content-type"].should.match(/html/);
            res.headers["content-type"].should.match(/utf-8/);
            res.text.should.match(/<html>/);
            res.text.should.match(/<index-link index="jit"/);
            res.text.should.match(/service="kinann-rest"/); // EJS injects service name
        }).end((err,res) => {if (err) throw err; else done(); });
    })
    it("GET /ui/app returns Angular static content", function(done) {
        var app = require("../scripts/kinann-node.js");

        supertest(app).get("/kinann-rest/ui/app/main-jit.js").expect((res) => {
            res.statusCode.should.equal(200); // redirect
            res.headers["content-type"].should.match(/application\/javascript/);
            res.text.should.match(/bootstrapModule/);
        }).end((err,res) => {if (err) throw err; else done(); });
    })
})
