var config = require('../../model/config') ;
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var User = require('../../models/User');


module.exports = function (passport) {
 
    passport.use(new SoundCloudStrategy(config.soundcloud,
        function (accessToken, refreshToken, profile, done) {
        console.log("profile "+ JSON.stringify(profile));

process.nextTick(function(){

                User.findOne({ 'soundcloud.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if(user) {
                        if (user.access_token == accessToken) {

                            console.log("user found " + JSON.stringify(user));
                            return done(err, user);
                        }
                        } else {
                            User.remove({'soundcloud.id' : "218749953"}, function (err, data) {
                                if(err){console.log("removing error")
                                }else{
                                    console.log("items removed")

                                }
                            })
                            var newUser = new User();
                            console.log("new user token")
                            newUser.soundcloud.id = profile.id; // Set the users facebook id
                            newUser.soundcloud.access_token = accessToken; // We will save the token that facebook provides to the user

                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                // If successful, return the new user
                                return done(null, newUser);
                            });
                        }


                });
            });
        }
    ));

}