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
                    this.resourceMethod("get", "position", this.getPosition),
                    this.resourceMethod("post", "position", this.postPosition),
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

        postPosition(req, res, next) {
            return new Promise((resolve, reject) => {
                this.taskBegin("postPosition");
                setTimeout(() => { // simulate real-time homing with complection callback
                    try {
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
                        this.taskEnd("postPosition");
                        resolve(this.positionResponse());
                    } catch(err) {
                        this.taskEnd("postPosition");
                        reject(err);
                    }
                }, 1000);
            });
        }

        postHome(req, res, next) {
            return this.taskPromise("postHome", (resolve, reject) => {
                this.df.home(req.body)
                    .then(() => resolve(this.positionResponse())
                    .catch((err) => reject(err);
                resolve(this.positionResponse());
            });
        }

        getConfig(req, res, next) {
            return {
                drives: this.drives,
            };
        }

        getState(req, res, next) {
            var superState = super.getState();
            var result =  Object.assign(superState, {
                position: this.positionResponse(),
                driveFrameState: this.df.state,
            });
            return result;
        }

    } //// class KinannRest

    module.exports = exports.KinannRest = KinannRest;
})(typeof exports === "object" ? exports : (exports = {}));
