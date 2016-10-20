var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var viewStatsSchema = new Schema({
    id: String,
    data: String,
    dataArray: Array,
    titleArray: Array
})



var collectionName = "test";
var ViewStats = mongoose.model('ViewStats', viewStatsSchema, "viewStats");

module.exports = ViewStats;