var mongoose = require('mongoose');

var Schema = mongoose.Schema;
    var blockSchema = new Schema({
    block: String,
    meta: []
})

var Schema = mongoose.Schema;
var postSchema = new Schema({
    postTitle: String,
    postContent: [blockSchema],
});

var collectionName = "test";
var Post = mongoose.model('Post', postSchema, "posts");

module.exports = Post;