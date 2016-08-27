var config = require('../../model/config');
var YoutubeStrategy = require('../youtube/strategy.js');
var User = require('../../models/User');

module.exports = function (passport) {

    passport.use('youtube', new YoutubeStrategy({

            clientID: config.youtube.clientID,
            clientSecret: config.youtube.clientSecret,
            callbackURL: config.youtube.callbackURL,
            authorizationParams: {
                access_type: 'offline',
                approval_prompt: 'auto'
            },
            scope: ['https://www.googleapis.com/auth/youtube']
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
                            return done(err, user);

                        }else {
                            var newUser = new User;
                            console.log("new yt user token");
                            newUser.youtube.id = profile.id;
                            newUser.youtube.access_token = accessToken;
                            newUser.youtube.refresh_token = refreshToken;

                            newUser.save(function (err) {
                                if (err) {
                                    console.log("new yt user err 1");
                                    throw err;
                                }
                                return done(null, newUser);
                            })
                        }
                    });



            }
    ))
}
