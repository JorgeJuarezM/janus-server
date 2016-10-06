module.exports = (function () {
    function F(connection) {
        this.connection = connection;
    }

    F.prototype.getConnector = function () {
        return this.connection.getConnector();
    };

    F.prototype.Execute = function (sqlCommand, callback) {
        console.log(sqlCommand.query.toString());
        this.connection.getConnector().getTransaction().Execute(sqlCommand.query.toString(), callback);
    };

    F.prototype.begin = function (callback) {
        this.connection.getConnector().getTransaction().begin(callback);
    };

    F.prototype.commit = function (callback) {
        this.connection.getConnector().getTransaction().commit(callback);
    };

    F.prototype.rollback = function (callback) {
        this.connection.getConnector().getTransaction().rollback(callback);
    };


    return F;
})();