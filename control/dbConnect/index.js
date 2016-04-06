var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('openDb', server);
var functions = {};
functions.open = function(req, res, next){
    db.open(function(err, db) {
        if(!err) {
            console.log("We are connected");
        }
    });
}
functions.db =  db;
module.exports = functions;