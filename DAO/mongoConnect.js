var mongoose = require('mongoose');
var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('test', server);


module.exports = db;
