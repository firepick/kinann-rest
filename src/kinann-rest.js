(function(exports) {
    const Variable = require("drive-frame").Variable;
    const StepperDrive = require("drive-frame").StepperDrive;
    const DriveFrame = require("drive-frame").DriveFrame;
    const winston = require('winston');
    const path = require("path");
    const rb = require("rest-bundle");
    const DRIVE_NAMES = [
        'X',
        'Y',
        'Z',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
    ];

    class KinannRest extends rb.RestBundle {
        constructor(name = "kinann", options = {}) {
            super(name, Object.assign({
                srcPkg: require("../package.json"),
            }, options));

            Object.defineProperty(this, "handlers", {
                value: super.handlers.concat([
                    this.resourceMethod("get", "drives", this.getDrives),
                    this.resourceMethod("put", "drives", this.putDrives),
                    this.resourceMethod("get", "drives/ScrewDrive", this.getScrewDrive),
                    this.resourceMethod("get", "drives/BeltDrive", this.getBeltDrive),
                    this.resourceMethod("get", "drives/GearDrive", this.getGearDrive),
                    this.resourceMethod("get", "position", this.getPosition),
                    this.resourceMethod("post", "move-to", this.postMoveTo),
                    this.resourceMethod("post", "home", this.postHome),
                ]),
            });
            this.apiDrives = `KinannRest.${name}.drives`;
            this.options = Object.assign({},options);
            var drives = options.drives || [
                new StepperDrive.BeltDrive(),
                new StepperDrive.BeltDrive(),
                new StepperDrive.ScrewDrive(),
            ];
            this.updateDrives(drives);
        }

        updateDrives(drives) {
            var json = drives.map(d => JSON.stringify(d));
            var newDrives = json.map(j => StepperDrive.fromJSON(j));
            this.df = new DriveFrame(newDrives, this.options);
        }

        get drives() {
            return this.df.drives;
        }

        get kinann() {
            return this.knn;
        }

        set kinann(knn) {
            return this.knn = knn;
        }

        driveName(iDrive) {
            var name = DRIVE_NAMES[iDrive];
            return name || ("Drive"+iDrive);
        }

        positionResponse() {
            var drivePos = this.df.drivePos;
            var motorPos = this.df.toMotorPos(drivePos);
            return {
                motor: motorPos,
                axis: drivePos,
            }
        }

        getScrewDrive(req, res, next) {
            return new StepperDrive.ScrewDrive({
                name: this.driveName(this.drives.length),
            });
        }

        getBeltDrive(req, res, next) {
            return new StepperDrive.BeltDrive({
                name: this.driveName(this.drives.length),
            });
        }

        getGearDrive(req, res, next) {
            return new StepperDrive.GearDrive({
                name: this.driveName(this.drives.length),
            });
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

        loadApiModel(filePath) {
            return new Promise((resolve, reject) => {
                super.loadApiModel(filePath)
                .then(model => {
                    if (model) {
                        this.updateDrives(model.drives);
                        resolve(model);
                    } else if (filePath === this.apiDrives) {
                        resolve({
                            drives: this.drives,
                        });
                    } else {
                        reject(new Error("unknown api model:"+filePath));
                    }
                })
                .catch(err => reject(err));
            });
        }

        saveApiModel(model, filePath) {
            return new Promise((resolve, reject) => {
                super.saveApiModel(model, filePath)
                .then(res => {
                    if (filePath === this.apiDrives) {
                        this.updateDrives(model.drives);
                    }
                    resolve(res);
                })
                .catch(e => reject(e));
            });
        }

        getDrives(req, res, next) {
            return this.getApiModel(req, res, next, this.apiDrives);
        }

        putDrives(req, res, next) {
            return this.putApiModel(req, res, next, this.apiDrives);
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
