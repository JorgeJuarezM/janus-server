var JanusServer = require("./index");
var janusServer = new JanusServer({
    appPath    : __dirname,
    staticApps : {
        "/example-static": "examples/staticApp"
    },
    policies   : {
        "*"              : ["logUrl"],
        "/example-static": ["sayHello", "auth"]
    },
    paths      : {
        policies: "examples/policies",
        rpc     : "examples/rpc"
    },
    connections: {
        janus: {
            server  : "172.16.100.6",
            user    : "kosmos",
            password: "45645645654546",
            database: "kosmosDev"
        },
        test : {
            host    : "172.16.100.152",
            user    : "root",
            password: "45645546456",
            database: "janus",
            type    : "mysql"
        }
    }
});
// // janusServer.Run();

var async__ = require("asyncawait/async");
var await__ = require("asyncawait/await");

var cnn  = janusServer.getConnection("test"); //DbConnection
var tran = new janusServer.data.DbTransaction(cnn);


cnn.connect(function () {
    console.log("Connected");
    var cmd = new janusServer.data.DbCommand.Select("T1", tran);
    // cmd.limit(1);

    cmd.query = "INSERT INTO T1 (id) values (1)";

    tran.begin(function () {
        cmd.execute(function () {
            console.log("Finalizado");
            console.log(arguments);
            tran.rollback();
        });
    });


});
