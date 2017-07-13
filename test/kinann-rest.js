(typeof describe === 'function') && describe("KinannRest", function() {
    const should = require("should");
    const KinannRest = require("../src/kinann-rest");
    const supertest = require('supertest');
    const winston = require('winston');
    const rb = require('rest-bundle');
    const fs = require('fs');
    const KINEMATICS_PATH = 'api-model/KinannRest.test.kinematics.json';
    var rbh = new rb.RbHash();
    var app = require("../scripts/server.js");
    winston.level = "warn";

    var pkg = require("../package.json");
    function expectedScrewDrive(axis) {
        return {
            gearIn: 1,
            gearOut: 1,
            lead: 0.8,
            maxPos: 10,
            microsteps: 16,
            minPos: 0,
            mstepPulses: 1,
            steps: 200,
            type: "ScrewDrive",
            name: axis,
            isHomeable: true,
        }
    }
    function expectedBeltDrive(axis) {
        return {
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
            name: axis,
            isHomeable: true,
        }
    }
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }
    function krTest(app) {
        return app.locals.restBundles.filter(rb => rb.name==='test')[0];
    }
    function testInit() { // initialize singleton for each test
        var testDriveFrame = krTest(app).df;
        testDriveFrame.serialDriver.mockSerialTimeout = 1;
        testDriveFrame.clearPos(); // initialize
        should.deepEqual(testDriveFrame.axisPos, [null,null,null]);
        return app;
    }

    it("Initialize TEST suite", function(done) { // THIS TEST MUST BE FIRST
        var async = function*() {
            if (krTest(app) == null) {
                yield app.locals.asyncOnReady.push(async);
            }
            winston.info("test suite initialized");
            done();
        }();
        async.next();
    });
    it("GET /kinematics returns kinematic configuration", function(done) {
        var async = function* () {
            try {
                var app = testInit();
                fs.existsSync(KINEMATICS_PATH) && fs.unlinkSync(KINEMATICS_PATH);
                yield supertest(app).get("/test/kinematics").expect((res) => {
                    res.statusCode.should.equal(200);
                    var apiModel = res.body.apiModel;
                    should.ok(apiModel);
                    var drives = apiModel.drives;
                    drives.should.instanceOf(Array);
                    drives.length.should.equal(3);
                    should.deepEqual(drives[0], expectedBeltDrive("X"));
                    should.deepEqual(drives[1], expectedBeltDrive("Y"));
                    should.deepEqual(drives[2], expectedScrewDrive("Z"));
                    apiModel.should.properties({
                        rbHash:rbh.hash(apiModel),
                    });
                }).end((e,r) => e ? async.throw(e) : async.next(r));
                done();
            } catch(err) {
                winston.error(err.message, err.stack);
                async.throw(err);
            }
        }();
        async.next();
    });
    it("TESTPUT /kinematics saves kinematic configuration", function(done) {
        var async = function* () {
            try {
                var app = testInit();
                fs.existsSync(KINEMATICS_PATH) && fs.unlinkSync(KINEMATICS_PATH);
                var result = yield supertest(app).get('/test/kinematics').expect(res => {
                    res.statusCode.should.equal(200);
                    should.ok(res.body.apiModel);
                }).end((e,r) => e ? async.throw(e) : async.next(r));
                var curState = result.body;
                var updateState = JSON.parse(JSON.stringify(curState))
                updateState.apiModel.drives[0].maxPos++;
                var newState = null;
                yield supertest(app).put("/test/kinematics").send(updateState).expect((res) => {
                    res.statusCode.should.equal(200);
                    should.ok(res.body.apiModel);
                    newState = JSON.parse(JSON.stringify(updateState));
                    newState.apiModel.rbHash = rbh.hash(newState.apiModel);
                    should.deepEqual(res.body, newState);
                    newState.apiModel.rbHash.should.not.equal(curState.apiModel.rbHash);
                }).end((e,r) => e ? async.throw(e) : async.next(r));
                yield supertest(app).get('/test/kinematics').expect(res => {
                    res.statusCode.should.equal(200);
                    should.ok(res.body.apiModel);
                    should.deepEqual(res.body, newState);
                }).end((e,r) => e ? async.throw(e) : async.next(r));
                should.ok(fs.existsSync(KINEMATICS_PATH));
                done();
            } catch (err) {
                winston.error(err.message, err.stack);
                async.throw(err);
            }
        }();
        async.next();
    });
    it("PUT /kinematics rejects bad request", function(done) {
        var async = function* () {
            try {
                var app = testInit();
                var result = yield supertest(app).get('/test/kinematics').expect(res => {
                    res.statusCode.should.equal(200);
                    should.ok(res.body.apiModel);
                }).end((e,r) => e ? async.throw(e) : async.next(r));
                var curModel = result.body.apiModel;
                supertest(app).put("/test/kinematics").send("bad request").expect((res) => {
                    res.statusCode.should.equal(400);
                    should.ok(res.body.error);
                    should.ok(res.body.data);
                    should.deepEqual(res.body.data.apiModel, curModel);
                }).end((err,res) => {if (err) throw err; else done(); });
            } catch (err) {
                winston.error(err.message, err.stack);
                async.throw(err);
            }
        }();
        async.next();
    });
    it("GET /config returns kinann configuration", function(done) {
        var app = testInit();
        supertest(app).get("/test/config").expect((res) => {
            res.statusCode.should.equal(200);
            res.headers["content-type"].should.match(/json/);
            res.headers["content-type"].should.match(/utf-8/);
            var config  = res.body;
            config.should.properties(["drives"]);
            var drives = config.drives;
            drives.should.instanceOf(Array);
            drives.length.should.equal(3);
            should.deepEqual(drives[0], expectedBeltDrive("X"));
            should.deepEqual(drives[1], expectedBeltDrive("Y"));
            should.deepEqual(drives[2], expectedScrewDrive("Z"));
        }).end((err,res) => {if (err) throw err; else done(); });
    });
    it("GET /state returns DriveFrame state", function(done) {
        var async = function*() {
            testInit();
            var testDriveFrame = krTest(app).df;
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
            testInit();
            var testDriveFrame = krTest(app).df;
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
            testInit();
            var testDriveFrame = krTest(app).df;
            yield testDriveFrame.home([true]).then(r => async.next(r));
            should.deepEqual(testDriveFrame.axisPos, [0,null,null]);
            supertest(app).post("/test/home").send([null,10]).expect((res) => {
                try {
                    res.statusCode.should.equal(200);
                    res.headers["content-type"].should.match(/json/);
                    res.headers["content-type"].should.match(/utf-8/);
                    should.deepEqual(testDriveFrame.axisPos, [0, 10, null]);
                    should.deepEqual(res.body, {
                        motor: [0,1000,null],
                        axis: [0,10,null],
                    });
                } catch (err) {
                    winston.error(err.message);
                    throw err;
                }
            }).end((err,res) => {if (err) throw err; else done(); });
        }();
        async.next();
    })
    it("POST /move-to sets DriveFrame position in motor coordinates", function(done) {
        var app = testInit();
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
        var async = function*() {
            testInit();
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
        }();
        async.next();
    });
    it("POST /move-to requires valid position", function(done) {
        var async = function*() {
            testInit();
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
    it("finalize TEST suite", function() {
        app.locals.rbServer.close();
        winston.info("end test suite");
    });
})
