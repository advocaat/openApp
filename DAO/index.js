var mongoose = require('mongoose');
var Post = require('../models/Post');
var TrackStats = require('../models/TrackStats')
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

functions.insertTrackStats = function(trackStats){
    TrackStats.remove({}, function(err, data){
        if(err){
            console.log("removing error");
        }
    })
    
    trackStats.forEach(function(stat){
        var track = new TrackStats();
        track.id = stat.id;
        track.artist = stat.artist;
        track.title = stat.title;
        track.views = stat.views; 
        track.favorites = stat.favorites;
        track.uploaded = stat.uploaded;
        track.save(function(err){
            if(err){
                console.log("error saving "+  err);
            }
            else{
                console.log("saved");
            }
        })
    })
    
    
}


functions.pullStats = function(callback) {
    TrackStats.find({}, function(err, docs){
        if(err){
            console.log("pull stat error " + err )
        } else{
            console.log("docs: " + JSON.stringify(docs))
        }
        callback(docs)
    })
}

module.exports = functions;