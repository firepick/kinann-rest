const should = require("should");
const KinannRest = require("../src/kinann-rest");
const supertest = require('supertest');

(typeof describe === 'function') && describe("KinannRest", function() {

    var pkg = require("../package.json");
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }

    it("GET /state returns DriveFrame state", function(done) {
        var app = require("../scripts/server.js");
        var service = app.restService;
        supertest(app).get("/test/state").expect((res) => {
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
        var app = require("../scripts/server.js");
        var service = app.restService;
        supertest(app).get("/test/position").expect((res) => {
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
        var app = require("../scripts/server.js");
        var service = app.restService;
        var axis123 = {
            axis: [1,2,3],
        }
        supertest(app).post("/test/position").send(axis123).expect((res) => {
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
        var app = require("../scripts/server.js");
        var service = app.restService;
        var motor123 = {
            motor: [100,200,7680],
        }
        supertest(app).post("/test/position").send(motor123).expect((res) => {
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
        var app = require("../scripts/server.js");
        var service = app.restService;
        var ambiguous123 = {
            axis: [1,2,3],
            motor: [1,2,3],
        }
        supertest(app).post("/test/position").send(ambiguous123).expect((res) => {
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
        var app = require("../scripts/server.js");
        var service = app.restService;
        supertest(app).post("/test/position").send({here:42}).expect((res) => {
            res.statusCode.should.equal(500);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                error: 'unknown position:{"here":42}',
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
})
