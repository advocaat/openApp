var BeatportStrategy = require('passport-beatport').Strategy;

var config = require('../../model/config');
var User = require('../../models/User');
module.exports = function(passport){
passport.use(new BeatportStrategy({
        consumerKey: config.beatport.apiKey,
        consumerSecret: config.beatport.apiSecret,
        callbackURL: config.beatport.callbackUrl
    },
    function(token, tokenSecret, profile, done) {
        User.findOne({'beatport.id': profile.id}, function (err, user) {
            if (err) {
                return done(err);
            }
            if(user) {
                if (user.access_token == token) {

                    console.log("user found " + JSON.stringify(user));
                    return done(err, user);
                }
            } else {
                User.remove({'beatport.id' : ""}, function (err, data) {
                    if(err){console.log("removing error")
                    }else{
                        console.log("items removed")

                    }
                })
                var newUser = new User();
                console.log("new user token");
                newUser.beatport.id = profile.id; // Set the users facebook id
                newUser.beatport.access_token = token; // We will save the token that facebook provides to the user
                newUser.beatport.access_token_secret = tokenSecret;
               
                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    // If successful, return the new user
                    return done(null, newUser);
                });
            }
        });
    }));
    
    
}
