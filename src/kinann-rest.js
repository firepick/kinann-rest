const Kinann = require("kinann");
const Factory = Kinann.Factory;
const Variable = Kinann.Variable;
const StepperDrive = Kinann.StepperDrive;
const DriveFrame = Kinann.DriveFrame;
const pkg = require("../package.json");
var rb = require("rest-bundle");

(function(exports) {
    class KinannRest extends rb.RestBundle {
        constructor(name="kinann", options = {}) {
            super(name, options);
            var handlers = [
                this.resourceMethod("get", "identity", this.getIdentity),
                this.resourceMethod("get", "state", this.getState),
                this.resourceMethod("get", "position", this.getPosition),
                this.resourceMethod("post", "position", this.setPosition),
            ];
            Object.defineProperty(this, "handlers", {
                value: handlers,
            });
            this.drives = options.drives || [
                new StepperDrive.BeltDrive({
                    minPos: 0,
                    maxPos: 100,
                    teeth: 16,
                }),
                new StepperDrive.BeltDrive({
                    minPos: 0,
                    maxPos: 100,
                    teeth: 16,
                }),
                new StepperDrive.ScrewDrive({
                    minPos: 0,
                    maxPos: 10,
                    lead: 0.8, // m5 screw
                }),
            ];
            this.df = new DriveFrame(this.drives);
        }

        get kinann() {
            return this.knn;
        }

        set kinann(knn) {
            return this.knn = knn;
        }

        getIdentity(req, res, next) {
            return {
                name: pkg.name,
                version: pkg.version,
            }
        }

        getState(req, res, next) {
            return this.df.state;
        }

        positionResponse() {
            var axisPos = this.df.axisPos;
            var motorPos = this.df.toMotorPos(axisPos);
            return {
                motor: motorPos,
                axis: axisPos,
            }
        }

        getPosition(req, res, next) {
            return this.positionResponse();
        }

        setPosition(req, res, next) {
            var position = req.data;
            if (position.axis) {
                this.df.axisPos = position.axis;
            } else if (position.motor) {
                this.df.axisPos = this.df.toAxisPos(position.motor);
            } else if (position.world) {
                throw new Error("not implemented");
            } else {
                throw new Error("unknown position:" + JSON.stringify(position));
            }
            return this.positionResponse();
        }

    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));

(typeof describe === 'function') && describe("KinannRest", function() {
    const should = require("should");
    const MockExpress = require("rest-bundle").MockExpress;
    const KinannRest = exports.KinannRest;
    var application_json_200 = {
        statusCode: 200,
        type: "application/json",
    }

    it("TBD", function() {
        var app = new MockExpress();
        var service = new KinannRest("kinann"); 
        service.bindExpress(app);
        return;
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
