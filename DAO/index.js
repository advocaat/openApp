var mongoose = require('mongoose');
var Post = require('../models/Post');
var TrackStats = require('../models/TrackStats')
mongoose.connect("mongodb://localhost/test");
var ViewStats = require("../models/ViewStats")
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

functions.insertRegionViews = function(views, titles){
        ViewStats.findOne({id: "yt"}, function(err, doc){
            doc.data = JSON.stringify(views);
            doc.dataArray = views;
            doc.titleArray = titles;
            doc.save(function(err, status){
                if(err){
                    console.log(err);
                }else{
                    console.log("modified "+ status);
                }
            })
        })

    // {
    //         $set: {
    //             data: JSON.stringify(views),
    //             dataArray: views,
    //             titleArray: titles
    //         }
    //     }, {multi: false}, function (err, done) {
    //         if (err) {
    //             console.log("yt err " + err);
    //         }
    //         if (done.nModified < 1) {
    //             var stat = new ViewStats();
    //             stat.id = "yt";
    //             stat.data = JSON.stringify(views);
    //             stat.dataArray = views;
    //             stat.titleArray = titles;
    //             stat.save(function (err, status) {
    //                 if (err) {
    //                     console.log("error saving " + err);
    //                 }
    //                 else {
    //                     console.log("yt saved data " + status);
    //                 }
    //             })
    //         }
    //         else {
    //             console.log("yt got data " + JSON.stringify(done));
    //
    //         }

        }
    // }catch(err){
    //     console.log(err);
    //     var stat = new ViewStats();
    //     stat.id = "yt";
    //     stat.data = JSON.stringify(views);
    //     stat.dataArray = views;
    //     stat.titleArray = titles;
    //     stat.save(function (err) {
    //         if (err) {
    //             console.log("error saving " + err);
    //         }
    //         else {
    //             console.log("yt saved data ");
    //         }
    //     })
    // }
    


functions.getYoutubeViews = function(callback){
    ViewStats.findOne({id: "yt"}, function(err, docs){
        if(err){
            console.log("yt er" + err)
        }
        else{
            callback(docs);
        }
    })
}

functions.pullStats = function(callback) {
    var tStats;
    TrackStats.find({}, function(err, docs){
        if(err){
            console.log("pull stat error " + err )
        } else{
            console.log("docs: " + JSON.stringify(docs))
        }
        tStats = docs;
        callback(docs);
    })


}

module.exports = functions;