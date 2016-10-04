module.exports = (function () {
    function F(connector) {
        this.connector = connector;
    }

    F.prototype.getConnector = function () {
        return this.connector;
    };

    F.prototype.connect = function (callback) {
        console.log("connecting");
        this.connector.getConnection().connect(callback);
    };


    F.prototype.Execute = function (sqlCommand, callback) {
        this.connector.getConnection().Execute(sqlCommand.query.toString(), callback);
    };

    return F;
})();