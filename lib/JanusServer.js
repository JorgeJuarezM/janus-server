var CaptainsLog = require('captains-log');
var http        = require("http");
var express     = require("express");
var Eureca      = require("eureca.io");
var requireAll  = require("require-all");
var path        = require("path");
var fs          = require("fs");
var util        = require("util");
var extend      = require("extend");
var async__     = require("asyncawait/async");
var await__     = require("asyncawait/await");

function JanusServer(config) {
    this.log    = new CaptainsLog();
    this.app    = express();
    this.server = http.createServer(this.app);


    /** Config **/
    this.config = extend(true, {
        staticApps: {},
        policies  : {},
        paths     : {
            rpc: path.resolve(__dirname, "../examples/rpc")
        }
    }, config);

}

JanusServer.prototype.Run = function () {
    var self = this;

    // this.config.secureFolders.forEach(function (__folder__) {
    //     self.app.use(__folder__, self.config.authenticate.bind(self));
    // });

    Object.keys(this.config.staticApps).forEach(function (__staticApp) {
        var appPath  = self.config.staticApps[__staticApp];
        var appRoute = path.join(self.config.appPath, appPath);
        self.app.use(__staticApp, express.static(appRoute));
    });


    this.loadRPC();


    this.server.listen(3000);
};

JanusServer.prototype.loadRPC = function () {
    var self = this;

    var basePath = path.resolve(self.config.appPath, self.config.paths.rpc);

    var rpcFiles = fs.readdirSync(basePath);
    if (rpcFiles.length == 0) return;

    var eurecaServer = new Eureca.Server();
    eurecaServer.attach(this.server);


    eurecaServer.exports.execute = async__(function (__module__) {

        this.async     = true;
        var _args      = arguments;
        var _arguments = Object.keys(_args).map(function (__key__) {
            return _args[__key__];
        }).slice(1);

        var module = __module__.split(".")[0];
        var action = __module__.split(".")[1] || "Index";

        var filePath = path.resolve(basePath, module);

        delete require.cache[require.resolve(filePath)];
        var ModuleClass = require(filePath)(self);

        if (!ModuleClass.prototype.hasOwnProperty(action)) return self.log.error("Invalid Module Action!!");

        var moduleInstance = new ModuleClass();

        var actionFn = moduleInstance[action];
        this.return(await__(actionFn.apply(moduleInstance, _arguments)));

    });

};

module.exports = JanusServer;