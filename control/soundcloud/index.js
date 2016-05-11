//
// var soundcloud = require("soundcloud-node");

var User = require('../../models/User');
var SC = require('node-soundcloud');
var config = require('../../model/config');
var urls = require('../../model/urls');
var fs = require('fs');
var path = require('path');
var request = require("request");
var DAO = require('../../DAO')
var up = require('../../DAO/up');

functions = {};


functions.getFile = function () {
    up.gfs.findOne('5718a039f7cf2c0c2cf8ccf5', function (filename, data) {
        SC.post('/me/tracks/?client_id=' + config.soundcloud.clientID, {
            file: data,
            title: filename,
            encoding: 'multipart/form-data'
        }, function (err, data) {
            if (err) {
                console.log("my err" + JSON.stringify(err))
            } else {
                console.log("sent" + JSON.stringify(data))
            }
        });
    })
}

functions.getTracks = function (callback) {

    SC.get('/users/51708/tracks/?client_id=' + config.soundcloud.clientID, function (err, data) {
        console.log("tracks" + JSON.stringify(err));
        console.log("tracks" + JSON.stringify(data));
        var url = ""
        for (var elem in data) {
            url += data[elem]['id'] + ',';

        }
        callback(url.substring(0, url.lastIndexOf(",")));
    });
}

functions.getTrackData = function(tracks) {

    SC.get("/users/51708/tracks?ids=" + tracks + ";client_id=" + config.soundcloud.clientID, function (err, data) {
        console.log("track data " + JSON.stringify(data));
        var statList = [];
        for(var elem in data) {
            console.log("id " + data[elem]["id"] + data[elem]["title"].split("-")[0].trim() + " title " + data[elem]["title"] +
                " views " + data[elem]["playback_count"] + " uploaded " + data[elem]["created_at"] + " favorites " + data[elem]["favoritings_count"]);
            var trackStat = {};
            trackStat.id = data[elem]["id"];
            trackStat.artist = data[elem]["title"]
            trackStat.title = data[elem]["title"]
            trackStat.views = data[elem]["playback_count"];
            trackStat.favorites = data[elem]["favoritings_count"];
            trackStat.uploaded = data[elem]["created_at"];
            statList.push(trackStat);

        }

        console.log("statys " + statList.toString())
        DAO.insertTrackStats(statList);
    })
};
        // request({
        //     uri: "https://api-v2.soundcloud.com/tracks?ids=" + url + ";client_id=" + config.soundcloud.clientID,
        //     // uri: "https://api-v2.soundcloud.com/users/soundcloud:users:51708/tracks/soundcloud:tracks:ids:"+url.substring(0, url.lastIndexOf(","))+ "/stats"
        //     //  + "&resolution=day&client_id=" + config.soundcloud.clientID ,
        //     //uri: "https://api-v2.soundcloud.com/stream/users/51708?limit=40&client_id="+ config.soundcloud.clientID,
        //     method: "GET",
        //     timeout: 10000,
        //     followRedirect: true,
        //     maxRedirects: 10
        // }, function(error, response, body) {
        //     console.log("request tracks "+body);
        //         for (var elem in body) {
        //             url += body[elem]['id'] + ',';
        //             console.log("id " +  body[elem]["id"]+" title "+body[elem]["title"] +
        //                 " views " + body[elem]["playback_count"] + " uploaded " + body[elem]["created_at"])
        //         }
        // });





functions.authorizeSC = function () {
    User.findOne({'soundcloud.id': "218749953"}, function (err, user) {
        if (err) {
            return done(err);
        }
  
        if (user) {
            console.log("Init");
            console.log("user found " + JSON.stringify(user));
            SC.init({
                id: config.soundcloud.clientID,
                secret: config.soundcloud.clientSecret,
                uri: config.soundcloud.callbackURL,
                accessToken: user.soundcloud.access_token
            });
            // up.getFile('5718a039f7cf2c0c2cf8ccf5',function(blob, name) {
            //     console.log("Here mayte");
            //     SC.post('/me/tracks/?client_id=' + config.soundcloud.clientID, {
            //         file: blob,
            //         title: name
            //     }, function (err, data) {
            //         if (err) {
            //             console.log("my err" + JSON.stringify(err))
            //         } else {
            //             console.log("sent" + JSON.stringify(data))
            //         }
            //     });
            //
            //
            // })

        }

    });


}

functions.get = function (url) {
    SC.get(url, function (err, data) {
        if (err) {
            console.log("get error" + err);

        }
        else {
            console.log("get data " + JSON.stringify(data));
        }
    })
};


functions.SC = SC;


module.exports = functions;