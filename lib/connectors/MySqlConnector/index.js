var Sql        = require("mysql");
module.exports = (function () {
    function F(config) {
        this.type       = config.type;
        this.connection = Sql.createConnection(config);
    }

    F.prototype.getConnection = function () {
        return {
            c      : this.connection,
            connect: function (callback) {
                this.c.connect();
                callback();
            },
            Execute: function (queryString, callback) {
                console.log(queryString);
                this.c.query(queryString, function (err, rows, fields) {
                    callback(err, JSON.parse(JSON.stringify(rows)));
                });
            }
        }
    };

    F.prototype.getTransaction = function () {
        var self = this;
        return {
            c       : this.connection,
            Execute : function (sqlString, callback) {
                self.transaction.query(sqlString, function (err, rows) {
                    callback(err, rows);
                });
            },
            begin   : function (callback) {
                self.transaction = self.connection;
                self.transaction.beginTransaction(callback);
            },
            commit  : function (callback) {
                self.transaction.commit(callback);
            },
            rollback: function (callback) {
                self.transaction.rollback(callback);
            }
        }
    };


    return F;
})();