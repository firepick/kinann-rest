const Kinann = require("kinann");
const Factory = Kinann.Factory;
const Variable = Kinann.Variable;
const StepperDrive = Kinann.StepperDrive;
const DriveFrame = Kinann.DriveFrame;
const path = require("path");
var rb = require("rest-bundle");

(function(exports) {
    class KinannRest extends rb.RestBundle {
        constructor(name="kinann", options = {}) {
            super(name, Object.assign({
                srcPkg: require("../package.json"),
            },options));

            Object.defineProperty(this, "handlers", {
                value: super.handlers.concat([
                    this.resourceMethod("get", "config", this.getConfig),
                    this.resourceMethod("get", "state", this.getState),
                    this.resourceMethod("get", "position", this.getPosition),
                    this.resourceMethod("post", "position", this.setPosition),
                ]),
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
            var position = req.body;
            if (position.axis) { // priority #1
                this.df.axisPos = position.axis;
            } else if (position.motor) { // priority #2
                this.df.axisPos = this.df.toAxisPos(position.motor);
            } else if (position.world) { // priority #3
                throw new Error("world position not implemented");
            } else {
                throw new Error("unknown position:" + JSON.stringify(position));
            }
            return this.positionResponse();
        }

        getConfig(req, res, next) {
            return {
                drives: this.drives,
            };
        }

        getState(req, res, next) {
            return this.df.state;
        }

    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));
