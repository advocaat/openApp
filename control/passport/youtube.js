var config = require('../../model/config');

var youtube = require('passport-youtube-v3');
YoutubeStrategy = youtube.Strategy;
var request = require('request');
var GoogleStrategy = require('passport-google').Strategy;
var User = require('../../models/User');

module.exports = function (passport) {
    console.log('yt here');
    passport.use('youtube', new YoutubeStrategy({

            clientID: config.youtube.clientID,
            clientSecret: config.youtube.clientSecret,
            callbackURL: config.youtube.callbackURL,
            scope: ['https://gdata.youtube.com', 'https://www.googleapis.com/auth/youtube.readonly','https://www.googleapis.com/auth/yt-analytics.readonly', 'https://www.googleapis.com/auth/youtubepartner' ]
        },
        function(accessToken, refreshToken, profile, done) {
                console.log("yt user:" + JSON.stringify(profile));
                console.log("yt access:" + JSON.stringify(accessToken));

                    User.findOne({'youtube.id': profile.id}, function (err, user) {

                        if (err){
                            console.log("yt 1");
                            return done(err);
                        }
                        if (user) {
                            console.log("yt user found " + JSON.stringify(user));
                            getExpiresIn(accessToken, user, refreshToken, function(data){
                                user.youtube.access_token = accessToken;
                                user.youtube.refresh_token = refreshToken;
                                user.youtube.expires_in = new Date().getTime() + (parseInt(data) * 1000);
                                user.save();

                                return done(null, user);
                            });


                        }else {
                            var newUser = new User;
                            var rToken = refreshToken;
                            console.log("new yt user token");
                            newUser.youtube.id = profile.id;
                            getExpiresIn(accessToken, newUser, rToken, function(data){
                                newUser.youtube.access_token = accessToken;
                                newUser.youtube.refresh_token = rToken;
                                newUser.youtube.expires_in = new Date().getTime() + (parseInt(data) * 1000);
                                newUser.save(function (err) {
                                    if (err) {
                                        console.log("new yt user err 1");
                                        throw err;
                                    }
                                    return done(null, newUser);
                                })
                            })

                        }
                    });



            }
    ))
}


function getExpiresIn(accessToken,user, refreshToken, callback){
    request({url: "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token="+ accessToken}, function(err, res, body){
        callback(JSON.parse(res.body)["expires_in"]);
    })
}