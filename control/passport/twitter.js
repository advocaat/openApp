/**
 * Created by Marc on 2/08/2016.
 * Twitter authentication
 */

var TwitterStrategy = require('passport-twitter').Strategy;
var config = require("../../model/config.js");
var User = require("../../models/User.js");
module.exports = function(passport) {

    passport.use('twitter', new TwitterStrategy({
            consumerKey: config.twitter.apiKey,
            consumerSecret: config.twitter.apiSecret,
            callbackURL: config.twitter.callbackURL
        },
        function (token, tokenSecret, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {
                User.findOne({'twitter.id': profile.id}, function (err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser = new User();
                        // set all of the user data that we need
                        newUser.twitter.id = profile.id;
                        newUser.twitter.access_token = token;
                        newUser.twitter.access_token_secret = tokenSecret;
                        //newUser.twitter.lastStatus = profile._json.status.text;
                        // save our user into the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};