// var JanusServer = require("./lib/JanusServer");
//
// var options = {
//     staticApps: {
//         "/": __dirname
//     }
// };
//
// var janusServer = new JanusServer(options);
// janusServer.Run();


module.exports = require("./lib/JanusServer");


// #!/usr/bin/env node
//
// var minimist = require("minimist");
// var Forever  = require("./bin/forever");
//
// (function (args) {
//     var f = new Forever();
//     if (args._.indexOf("start") > -1) {
//         f.Start();
//     } else if (args._.indexOf("stop") > -1) {
//         f.Stop();
//     } else if (args._.indexOf("restart") > -1) {
//         f.Restart();
//     }
// })(minimist(process.argv) || {});