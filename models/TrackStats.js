var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// var blockSchema = new Schema({
//     destination: String,
//     block: String,
//     meta: []
// })
//
// var Schema = mongoose.Schema;
// var postSchema = new Schema({
//     postTitle: String,
//     postContent: [blockSchema],
// });

var trackStatsSchema = new Schema({
    id: String,
    artist: String,
    title: String,
    views: Number,
    favorites: Number,
    uploaded: Date
})

var statStackSchema = new Schema({
    stats : [trackStatsSchema]
})

var collectionName = "test";
var TrackStats = mongoose.model('TrackStats', trackStatsSchema, "trackStats");

module.exports = TrackStats;