var mongoose = require('mongoose');
var Post = require('../models/Post');
mongoose.connect("mongodb://localhost/test");

var functions = {};

functions.uploadPost = function(postTitle, contentList ){
    var post = new Post();
    post.postTitle = postTitle;
    contentList.forEach(function(content){
       post.postContent.push({block: content.myContent, meta: content.myMeta});
    });
    post.save(function(err){
        if(err){
            console.log(err);
        }else{
            console.log("saved")
        }

    });

}
module.exports = functions;