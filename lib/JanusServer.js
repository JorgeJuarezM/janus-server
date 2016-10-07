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
var bodyParser  = require('body-parser');
var basicAuth   = require('basic-auth-connect');

function JanusServer(config) {
    this.log       = new CaptainsLog();
    this.app       = express();
    this.server    = http.createServer(this.app);
    this.__async__ = async__;
    this.__await__ = await__;


    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());

    this.data = requireAll({
        dirname: path.resolve(__dirname, "db")
    });

    // console.log(this.data);


    /** Config **/
    this.config = extend(true, {
        staticApps: {},
        policies  : {},
        paths     : {
            rpc: path.resolve(__dirname, "../examples/rpc")
        }
    }, config);

}

JanusServer.prototype.getConnection = function (connectionName) {
    var Connector;
    var connectionConfig = this.config.connections[connectionName];
    if (!connectionConfig) throw new Error("Invalid Connection Name");

    var cnnType = connectionConfig.type || (connectionConfig.type = "mssql");

    switch (cnnType.toLowerCase()) {
        case "mssql":
            Connector = require("./connectors/MSSqlConnector");
            break;
        case "mysql":
            Connector = require("./connectors/MySqlConnector");
    }

    var connector = new Connector(connectionConfig);
    return new this.data.DbConnection(connector);
};

JanusServer.prototype.Run = function () {
    var self = this;

    Object.keys(this.config.staticApps).forEach(function (__staticApp) {
        var appPath  = self.config.staticApps[__staticApp];
        var appRoute = path.join(self.config.appPath, appPath);
        self.app.use(__staticApp, express.static(appRoute));
    });

    this.loadRPC();
    this.loadApi();
    this.server.listen(3000);
};


JanusServer.prototype.loadApi = function () {
    var self     = this;
    var basePath = path.resolve(self.config.appPath, self.config.paths.rpc);

    var rpcFiles = fs.readdirSync(basePath);
    if (rpcFiles.length == 0) return;


    // var basicAuth = express.basicAuth(function (user, pass, callback) {
    //     console.log(user, pass);
    //     callback(null, true);
    // });

    var bAuth = basicAuth(function (user, pass, callback) {
        if (user == "janus" && pass == "kosmos") {
            callback(null, true);
        } else {
            callback(new Error("Invalid User"), null);
        }
    });

    this.app.use("/invoke/:module/:action", bAuth, async__(function (req, res) {
        var module = req.params.module;
        var action = req.params.action;

        var _arguments = req.body.arguments || [];


        var filePath = path.resolve(basePath, module);
        var resolveData;
        console.log(filePath);
        try {
            delete require.cache[require.resolve(filePath)];
            var ModuleClass = require(filePath)(self);
            if (!ModuleClass) throw new Error("Invalid Module!");
            if (!ModuleClass.prototype.hasOwnProperty(action)) throw new Error("Invalid Module Action!!");

            var moduleInstance = new ModuleClass();
            var actionFn       = moduleInstance[action];

            resolveData = await__(actionFn.apply(moduleInstance, _arguments));
        } catch (ex) {
            self.log.error(ex);
            resolveData = {
                error: {
                    message: ex.message
                }
            };
        }

        res.send(resolveData);

    }));

};

JanusServer.prototype.loadRPC = function () {
    var self = this;

    var basePath = path.resolve(self.config.appPath, self.config.paths.rpc);

    var rpcFiles = fs.readdirSync(basePath);
    if (rpcFiles.length == 0) return;

    var eurecaServer = new Eureca.Server();
    eurecaServer.attach(this.server);


    eurecaServer.exports.execute = async__(function (__module__) {
        var context   = this;
        context.async = true;

        var _args      = arguments;
        var _arguments = Object.keys(_args).map(function (__key__) {
            return _args[__key__];
        }).slice(1);

        var module   = __module__.split(".")[0];
        var action   = __module__.split(".")[1] || "Index";
        var filePath = path.resolve(basePath, module);

        try {
            delete require.cache[require.resolve(filePath)];
            var ModuleClass = require(filePath)(self);
            if (!ModuleClass) throw new Error("Invalid Module!");
            if (!ModuleClass.prototype.hasOwnProperty(action)) throw new Error("Invalid Module Action!!");

            var moduleInstance = new ModuleClass();
            var actionFn       = moduleInstance[action];

            context.return(await__(actionFn.apply(moduleInstance, _arguments)));
        } catch (ex) {
            self.log.error(ex);
            context.return({
                error: {
                    message: ex.message
                }
            });
        }
    });

};

module.exports = JanusServer;