var fs = require('fs');
var sc = require('soundjs');
var config = require('../../model/config');
var path = require('path');
 var User = require('../../models/User');
var score = require('underscore');
var functions = {};
var up = require('../../DAO/up');
var gfs = require('gridfs-stream');
var removeFiles = require('../../model/uploads/removeFiles');



functions.uploadTrack = function(title, id, list, description, genre) {
    var scUpload = new sc(config.soundcloud.clientID, config.soundcloud.clientSecret, 'bobproman', 'advocaat', config.soundcloud.callbackURL);
    scUpload.playlists().then(function (playlist) {
        try {
            var playList = score.findWhere(playlist, {'title': list})
        }catch(err){console.log("playlist error "+ err)}
            console.log(playList);
        function source() {
            return fs.createReadStream(__dirname + '\\moo.mp3');
        }
        function myLen(){
            var stat = fs.statSync(__dirname +'\\moo.mp3');
            return stat.size;
        }
             try {
                scUpload.addTrack(title, description, genre, source).then(function (track) {
                    console.log("adding");
                    playList.setHeader("Content-Length", myLen());
                    playList.addTrack(track);
                });
            }catch(err){
                console.log("upload error "+ err);
            }
        })
}



functions.uploadMongo = function(title, mongoId, list, description, genre) {
    console.log('mongo id: ' + mongoId);
    up.saveFile(mongoId, function(filename){
        var scUpload = new sc(config.soundcloud.clientID, config.soundcloud.clientSecret, 'bobproman', 'advocaat', config.soundcloud.callbackURL);
        scUpload.playlists().then(function (playlist) {
            try {
                var playList = score.findWhere(playlist, {'title': list})
            }catch(err){console.log("playlist error "+ err)}
            console.log(playList);
            function source() {
                return fs.createReadStream(__dirname + "\\..\\..\\"+ filename);
            }
            function myLen(){
                console.log("dirname before: "+__dirname +"\\..\\..\\" +filename);
                var stat = fs.statSync(__dirname +"\\" +filename);
                return stat.size;
            }
            try {
                scUpload.addTrack(title, description, genre, source).then(function (track) {
                    console.log("adding");
                    playList.setHeader("Content-Length", myLen());
                    playlist.addTrack(track);
                });
            }catch(err){
                console.log("upload error "+ err);
            }
            removeFiles.addFile(filename);
        })
    })
}

function handleUpload(filename, callback){
    var stat = fs.statSync(__dirname + "\\..\\..\\"+ filename);
    while(!stat.isFile()){
        console.log("no file")
    }
    callback(filename);
}



module.exports = functions;