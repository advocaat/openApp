var conf = require('../../model/config');
var graph = require('../facebook/graph');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/User');
module.exports = function (passport) {
    passport.use('facebook', new FacebookStrategy(conf.fb,
        function (accessToken, refreshToken, profile, done) {
            console.log("fb access-token: "+ accessToken);
            // graph.setToken(accessToken);
            // graph.getPageAccess()          
            console.log('profile', profile);
            process.nextTick(function () {
            User.findOne({'local.username': "bob"}, function (err, user) {
                if (err) {
                    
                    return done(err);
                }
                
                if (user) {

                    console.log("found facebook" + accessToken);
                    user.local.facebook.access_token = accessToken;
                    user.local.facebook.refresh_token = refreshToken;
                    user.local.facebook.id = profile.id;
                    user.save(function (err, status) {
                        if (err) {
                            throw err;
                        }
                        console.log("reauthfb "+ JSON.stringify(status));
                        // If successful, return the new user
                        return done(null, user);
                    });

                } else {
                    
                    // If there is no user found with that facebook id, create them
                    var newUser = new User();
                    //console.log("fbrt" + JSON.stringify(JSON.parse(profile.body)));
                    // Set all of the facebook information in our user model
                    newUser.fb.id = profile.id; // Set the users facebook id
                    newUser.fb.access_token = accessToken; // We will save the token that facebook provides to the user
                    newUser.fb.firstName = profile.name.givenName;
                    newUser.fb.lastName = profile.name.familyName; // Look at the passport user profile to see how names are returned
                    // Save our user to the database
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