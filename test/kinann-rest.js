const should = require("should");
const KinannRest = require("../src/kinann-rest");
const MockExpress = require("rest-bundle").MockExpress;

(typeof describe === 'function') && describe("KinannRest", function() {
    var pkg = require("../package.json");
    console.log(pkg);

    it("/identity returns Kinann REST identity", function(done) {
        var app = new MockExpress();
        var service = new KinannRest("kinann"); 
        service.bindExpress(app);
        app.mockHttp("get", "/kinann/identity", (res) => {
            res.should.properties({
                statusCode: 200,
                type: "application/json",
                data: {
                    name: pkg.name,
                    version: pkg.version,
                }
            });
            app.count_next.should.equal(1);
            done();
        });
        return;
    })
})
