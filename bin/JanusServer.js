#!/usr/bin/env node
var fs          = require("fs");
var path        = require("path");
var JanusServer = require("../lib/JanusServer");
var requireAll  = require("require-all");

var config = requireAll({
    dirname: path.resolve(process.cwd(), "config")
});

config.appPath = process.cwd();

var janusServer = new JanusServer(config);
janusServer.Run();

// // var express = require("express");
// // var Forever = require("./forever");
// // var app     = express();
// // var forever = new Forever();
// //
// //
// // app.use("/restart", function (req, res) {
// //     res.end("Restarted");
// //     forever.Restart();
// // });
// //
// // app.listen(3000, function () {
// //     console.log(new Date());
// // });
//
// var JanusServer = (function () {
//     var path    = require("path");
//     var express = require("express");
//     var eureca  = require("eureca.io");
//     var http    = require("http");
//
//     var async__ = require("asyncawait/async");
//     var await__ = require("asyncawait/await");
//
//
//     var adminApp = express();
//     var server   = http.createServer(adminApp);
//
//     var eurecaServer = new eureca.Server();
//     eurecaServer.attach(server);
//
//     eurecaServer.exports.execute = async__(function (module) {
//         this.async = true;
//
//         var _arguments = arguments;
//         var _args      = Object.keys(_arguments).map(function (key) {
//             return _arguments[key];
//         }).slice(1);
//
//         var model       = module.split(".")[0];
//         var action      = module.split(".")[1] || "Index";
//         var filePath    = path.resolve(__dirname, "../models", model);
//         var ModuleClass = require(filePath);
//         require("util").inherits(ModuleClass, require("../models/Model"));
//         if (!ModuleClass.prototype.hasOwnProperty(action)) return console.log("Invalid Module");
//         var moduleInstance = new ModuleClass();
//         var fnAction       = moduleInstance[action];
//
//         var result = await__(fnAction.apply(moduleInstance, _args));
//         this.return(result);
//     });
//
//     function JanusServer() {
//         adminApp.use("/admin", express.static(path.resolve(__dirname, "../resources/apps/admin")));
//     }
//
//     JanusServer.prototype.run = function () {
//         server.listen(3000, function () {
//             console.log("Listen.....");
//         });
//     };
//
//     return JanusServer
//
// })();
//
// new JanusServer().run();