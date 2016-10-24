var config = require('../../model/config') ;
var SoundCloudStrategy = require('passport-soundcloud').Strategy;
var User = require('../../models/User');


module.exports = function (passport) {
 
    passport.use(new SoundCloudStrategy(config.soundcloud,
        function (accessToken, refreshToken, profile, done) {
        console.log("profile "+ JSON.stringify(JSON.parse(profile._raw.toString())["upload_seconds_left"]));


                
                User.findOne({'soundcloud.id': profile.id}, function (err, user) {
                    if (err) {
                        console.log("login error "+ err);
                        return done(err);
                    }
                    if(user) {
                        console.log("refresh "+ refreshToken);
                        if (user.soundcloud.access_token == accessToken) {

                            console.log("user found " + JSON.stringify(user)) ;
                            return done(null, user);

                        } else {
                            var doon = done;
                                    User.update({'soundcloud.id': "218749953"},{$set:{'soundcloud.access_token': accessToken, 'soundcloud.refresh_token': refreshToken, 'soundcloud.expires_in': (new Date().getTime() + (parseInt(JSON.parse(profile._raw.toString())["upload_seconds_left"])* 1000) )}}, {multi: false}, function(err, done){
                                if(err){
                                    console.log(err);
                                }else{
                                    return doon(null, user);
                                }
                            })

                        }

                    }else if(!user){
                        var newUser = new User();
                        console.log("new user token")
                        newUser.soundcloud.id = profile.id; // Set the users facebook id
                        newUser.soundcloud.access_token = accessToken; // We will save the token that facebook provides to the user
                        newUser.soundcloud.refresh_token = refreshToken;
                        newUser.soundcloud.expires_in = new Date().getTime() + (parseInt(JSON.parse(profile._raw.toString())["upload_seconds_left"]) * 1000) || null;
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }else {
                                // If successful, return the new user
                                return done(null, newUser);
                            }
                        });

                    }
                });
                        // var newUser = new User();
                        // console.log("new user token")
                        // newUser.soundcloud.id = profile.id; // Set the users facebook id
                        // newUser.soundcloud.access_token = accessToken; // We will save the token that facebook provides to the user
                        // newUser.save(function (err) {
                        //     if (err) {
                        //         throw err;
                        //     }
                        //     // If successful, return the new user
                        //     return done(null, newUser);
                        // });

        }
    ));

}