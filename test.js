var JanusServer = require("./index");
var janusServer = new JanusServer({
    appPath   : __dirname,
    staticApps: {
        "/example-static": "examples/staticApp"
    },
    policies  : {
        "*"              : ["logUrl"],
        "/example-static": ["sayHello", "auth"]
    },
    paths     : {
        policies: "examples/policies",
        rpc     : "examples/rpc"
    }
});
janusServer.Run();