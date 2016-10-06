var sql = require("squel");

// var Select = (function () {
//     function F(table, connection) {
//         this.table      = table;
//         this.connection = connection;
//
//         var query = this.query = sql.useFlavour(connection.getConnector().type).select().from(table);
//         this.where    = query.where;
//         this.join     = query.join;
//         this.leftJoin = query.left_join;
//         this.limit    = query.limit;
//     }
//
//     F.prototype.execute = function (callback) {
//         this.connection.Execute(this, callback);
//     };
//
//     return F;
//
// })();

// var Insert = (function () {
//     function F(table, connection) {
//         this.table      = table;
//         this.connection = connection;
//
//         var query = this.query = sql.useFlavour(connection.getConnector().type).insert().into(table);
//         this.setRowsFields = query.setRowsFields;
//     }
//
//     F.prototype.execute = function (callback) {
//         this.connection.Execute(this, callback);
//     };
//
//     return F;
//
// })();


// var Update = (function () {
//     function F(table, connection) {
//         this.table      = table;
//         this.connection = connection;
//
//         var query = this.query = sql.useFlavour(connection.getConnector().type).update().table(table);
//
//     }
// })();
//
// module.exports.Insert = Insert;

function DbCommand(connection) {
    this.connection = connection;
    var builder     = this.builder = sql.useFlavour(connection.getConnector().type);
}

DbCommand.prototype.Select = function () {
    this.query = this.builder.select();
    return this.query;
};

DbCommand.prototype.Insert = function () {
    this.query = this.builder.insert();
    return this.query;
};


DbCommand.prototype.Update = function () {
    this.query = this.builder.update();
    return this.query;
};

DbCommand.prototype.execute = function (callback) {
    this.connection.Execute(this, callback);
};


module.exports = DbCommand;