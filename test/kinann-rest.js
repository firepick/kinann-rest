(typeof describe === 'function') && describe("KinannRest", function() {
    const should = require("should");
    const KinannRest = require("../src/kinann-rest");
    const supertest = require('supertest');
    const winston = require('winston');
    winston.level = "warn";

    var pkg = require("../package.json");
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }
    function testApp() { // initialize singleton for each test
        var app = require("../scripts/server.js");
        var testDriveFrame = app.restService.df;
        testDriveFrame.serialDriver.mockSerialTimeout = 1;
        testDriveFrame.clearPos(); // initialize
        should.deepEqual(testDriveFrame.axisPos, [null,null,null]);
        return app;
    }

    it("GET /config returns kinann configuration", function(done) {
        var app = testApp();
        supertest(app).get("/test/config").expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            var config  = res.body;
            config.should.properties(["drives"]);
            var drives = config.drives;
            drives.should.instanceOf(Array);
            drives.length.should.equal(3);
            should.deepEqual(drives[0], {
                gearIn: 1,
                gearOut: 1,
                maxPos: 100,
                microsteps: 16,
                minPos: 0,
                mstepPulses: 1,
                pitch: 2,
                steps: 200,
                teeth: 16,
                type: "BeltDrive",
                name: "X",
                isHomed: true,
            });
            should.deepEqual(drives[1], {
                gearIn: 1,
                gearOut: 1,
                maxPos: 100,
                microsteps: 16,
                minPos: 0,
                mstepPulses: 1,
                pitch: 2,
                steps: 200,
                teeth: 16,
                type: "BeltDrive",
                name: "Y",
                isHomed: true,
            });
            should.deepEqual(drives[2], {
                gearIn: 1,
                gearOut: 1,
                lead: 0.8,
                maxPos: 10,
                microsteps: 16,
                minPos: 0,
                mstepPulses: 1,
                steps: 200,
                type: "ScrewDrive",
                name: "Z",
                isHomed: true,
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("GET /state returns DriveFrame state", function(done) {
        var async = function*() {
            var app = testApp();
            var testDriveFrame = app.restService.df;
            yield testDriveFrame.home().then(r => async.next(r));
            supertest(app).get("/test/state").expect((res) => {
                res.statusCode.should.equal(200);
                res.headers["content-type"].should.match(/json/);
                res.headers["content-type"].should.match(/utf-8/);
                var state = res.body;
                state.should.properties({
                    position: {
                        motor: [0,0,0],
                        axis: [0,0,0],
                    },
                });
                should.deepEqual(state.driveFrameState, testDriveFrame.state);
                testDriveFrame.state.should.instanceOf(Array); 
                testDriveFrame.state.length.should.equal(6);
            }).end((err,res) => {if (err) throw err; else done(); });
        }();
        async.next();
    });
    it("GET /position returns DriveFrame position", function(done) {
        var async = function*() {
            var app = testApp();
            var testDriveFrame = app.restService.df;
            yield testDriveFrame.home().then(r => async.next(r));
            supertest(app).get("/test/position").expect((res) => {
                res.statusCode.should.equal(200);
                res.headers["content-type"].should.match(/json/);
                res.headers["content-type"].should.match(/utf-8/);
                res.body.should.properties({
                        motor: [0,0,0],
                        axis: [0,0,0],
                });
            }).end((err,res) => {if (err) throw err; else done(); });
        }();
        async.next();
    })
    it("POST /home homes DriveFrame", function(done) {
        var async = function*() {
            var app = testApp();
            var testDriveFrame = app.restService.df;
            yield testDriveFrame.home({axis:0}).then(r => async.next(r));
            should.deepEqual(testDriveFrame.axisPos, [0,null,null]);
            supertest(app).post("/test/home").send({axis:0}).expect((res) => {
                res.statusCode.should.equal(200);
                res.headers["content-type"].should.match(/json/);
                res.headers["content-type"].should.match(/utf-8/);
                should.deepEqual(testDriveFrame.axisPos, [0, null, null]);
                should.deepEqual(res.body, {
                    motor: [0,null,null],
                    axis: [0,null,null],
                });
            }).end((err,res) => {if (err) throw err; else done(); });
        }();
        async.next();
    })
    it("POST /move-to sets DriveFrame position in motor coordinates", function(done) {
        var app = testApp();
        var motor123 = {
            motor: [100,200,7680],
        }
        supertest(app).post("/test/move-to").send(motor123).expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                motor: [100,200,7680],
                axis: [1,2,3],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("POST /move-to priority is: 1) axis, 2) motor", function(done) {
        var app = testApp();
        var ambiguous123 = {
            axis: [1,2,3],
            motor: [1,2,3],
        }
        supertest(app).post("/test/move-to").send(ambiguous123).expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            should.deepEqual(res.body, {
                motor: [100,200,7680],
                axis: [1,2,3],
            });
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("POST /move-to requires valid position", function(done) {
        var async = function*() {
            var app = testApp();
            supertest(app).post("/test/move-to").send({here:42}).expect((res) => {
                res.statusCode.should.equal(500);
                res.headers["content-type"].should.match(/json/);
                res.headers["content-type"].should.match(/utf-8/);
                should.deepEqual(res.body, {
                    error: 'moveTo() unknown position:{"here":42}',
                });
            }).end((err,res) => {if (err) throw err; else done(); });
        }();
        async.next();
    });
    it("Serialport", function(done) {
        var async = function*() {
            done();
        }();
        async.next();
    });
})
