const Kinann = require("kinann");
const Factory = Kinann.Factory;
const Variable = Kinann.Variable;
const StepperDrive = Kinann.StepperDrive;
const DriveFrame = Kinann.DriveFrame;
const path = require("path");
var rb = require("rest-bundle");

(function(exports) {
    class KinannRest extends rb.RestBundle {
        constructor(name = "kinann", options = {}) {
            super(name, Object.assign({
                srcPkg: require("../package.json"),
            }, options));

            Object.defineProperty(this, "handlers", {
                value: super.handlers.concat([
                    this.resourceMethod("get", "config", this.getConfig),
                    this.resourceMethod("get", "position", this.getPosition),
                    this.resourceMethod("post", "move-to", this.postMoveTo),
                    this.resourceMethod("post", "home", this.postHome),
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
            this.df = new DriveFrame(this.drives, options);
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

        postMoveTo(req, res, next) {
            var position = req.body;
            return this.taskPromise("postMoveTo " + position, (resolve, reject) => {
                this.df.moveTo(req.body)
                    .then(df => resolve(this.positionResponse()))
                    .catch(err => reject(err));
            });
        }

        postHome(req, res, next) {
            return this.taskPromise("postHome", (resolve, reject) => {
                this.df.home(req.body)
                    .then(() => resolve(this.positionResponse()))
                    .catch((err) => reject(err));
            });
        }

        getConfig(req, res, next) {
            return {
                drives: this.drives,
            };
        }

        getState() {
            var superState = super.getState();
            var result = Object.assign(superState, {
                position: this.positionResponse(),
            });
            if (this.df) {
                var df = this.df;
                result.driveFrameState = df.state;
                if (df.serialDriver) {
                    result.serialDriver = df.serialDriver.state;
                }
            }
            return result;
        }

    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));
