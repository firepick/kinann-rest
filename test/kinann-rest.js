const should = require("should");
const KinannRest = require("../src/kinann-rest");
const MockExpress = require("rest-bundle").MockExpress;

(typeof describe === 'function') && describe("KinannRest", function() {
    var pkg = require("../package.json");
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }

    it("/identity returns Kinann REST identity", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("kinann"); 
        service.bindExpress(app);
        app.mockGET("/kinann/identity", (res) => {
            res.should.properties(application_json_200);
            res.data.should.properties({
                name: pkg.name,
                version: pkg.version,
            });
            app.count_next.should.equal(1);
            done();
        });
    })
    it("GET /state returns DriveFrame state", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("pnp"); 
        service.bindExpress(app);
        app.mockGET("/pnp/state", (res) => {
            res.should.properties(application_json_200);
            should.deepEqual(res.data, service.df.state);
            app.count_next.should.equal(1);
            done();
        });
        service.df.state.should.instanceOf(Array);
        service.df.state.length.should.not.below(3);
    });
    it("GET /position returns DriveFrame position", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("paste"); 
        service.bindExpress(app);
        app.mockGET("/paste/position", (res) => {
            res.should.properties(application_json_200);
            res.data.should.properties({
                    motor: [0,0,0],
                    axis: [0,0,0],
            });
            app.count_next.should.equal(1);
            done();
        });
    });
    it("POST /position sets DriveFrame position in axis coordinates", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("drill"); 
        service.bindExpress(app);

        var axis123 = {
            axis: [1,2,3],
        }
        app.mockPOST("/drill/position", axis123, (res) => {
            res.should.properties(application_json_200);
            res.data.should.properties({
                motor: [100,200,7680],
                axis: [1,2,3],
            });
            app.count_next.should.equal(1);
            done();
        }, axis123);
    })
    it("POST /position sets DriveFrame position in motor coordinates", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("stamp"); 
        service.bindExpress(app);
        var motor123 = {
            motor: [100,200,7680],
        }
        app.mockPOST("/stamp/position", motor123, (res) => {
            res.should.properties(application_json_200);
            res.data.should.properties({
                motor: [100,200,7680],
                axis: [1,2,3],
            });
            app.count_next.should.equal(1);
            done();
        }, motor123);
    });
    it("POST /position priority is: 1) axis, 2) motor", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("kinann"); 
        service.bindExpress(app);
        var position123 = {
            axis: [1,2,3],
            motor: [1,2,3],
        }
        app.mockPOST("/kinann/position", position123, (res) => {
            res.should.properties(application_json_200);
            res.data.should.properties({
                motor: [100,200,7680],
                axis: [1,2,3],
            });
            app.count_next.should.equal(1);
            done();
        }, position123);
    });
})
