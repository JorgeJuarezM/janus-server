var Sql        = require("mssql");
module.exports = (function () {
    function F(config) {
        this.type       = config.type;
        this.connection = new Sql.Connection(config);
    }

    F.prototype.getConnection = function () {
        return {
            c      : this.connection,
            connect: function (callback) {
                this.c.connect(callback);
            },
            Execute: function (queryString, callback) {
                //console.log(queryString);
                var request = this.c.request();
                request.query(queryString, callback);
            }
        }
    };

    F.prototype.getTransaction = function () {
        var self = this;
        return {
            c       : this.connection,
            Execute : function (querystring, callback) {
                var request = self.transaction.request();
                request.query(querystring, callback);
            },
            begin   : function (callback) {
                self.transaction = this.c.transaction();
                console.log("Begin Transaction");
                self.transaction.begin(callback);
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