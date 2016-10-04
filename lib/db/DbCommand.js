var sql = require("squel");

var Select = (function () {
    function F(table, connection) {
        this.table      = table;
        this.connection = connection;

        var query = this.query = sql.useFlavour(connection.getConnector().type).select().from(table);
        this.where    = query.where;
        this.join     = query.join;
        this.leftJoin = query.left_join;
        this.limit    = query.limit;
    }

    F.prototype.execute = function (callback) {
        this.connection.Execute(this, callback);
    };

    return F;

})();

var Insert = (function () {
    function F(table, connection) {
        this.table      = table;
        this.connection = connection;

        var query = this.query = sql.useFlavour(connection.getConnector().type).insert().into(table);
        this.setRowsFields = query.setRowsFields;
    }

    F.prototype.execute = function (callback) {
        this.connection.Execute(this, callback);
    };

    return F;

})();

module.exports.Insert = Insert;
module.exports.Select = Select;