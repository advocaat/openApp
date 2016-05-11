var conf = require('../../model/config');
var graph = require('../facebook/graph');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/User');
module.exports = function (passport) {
    passport.use('facebook', new FacebookStrategy(conf.fb,
        function (accessToken, refreshToken, profile, done) {
            console.log("fb access-token: "+ accessToken);
            graph.setToken(accessToken);
            graph.getPageAccess()          
            console.log('profile', profile);
            process.nextTick(function () {
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if (err) {

                    return done(err);
                }
                
                if (user) {
                    console.log("found facebook");
                    return done(null, user); // User found, return that user
                } else {
                    
                    // If there is no user found with that facebook id, create them
                    var newUser = new User();
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