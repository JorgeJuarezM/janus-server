var forever = require("forever");
var path    = require("path");

module.exports = (function () {
    function F() {

    }

    F.prototype.Start = function () {
        var file = path.resolve(__dirname, "JanusServer.js");
        console.log(file);
        forever.startDaemon(file, {
            uid: "janus"
        });
    };

    F.prototype.Stop = function () {
        forever.stop("janus");
    };

    F.prototype.Restart = function () {
        this.Stop();
        this.Start();
    };

    return F;
})();