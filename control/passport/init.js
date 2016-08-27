var User = require('../../models/user');
var login = require('./login');
var signup = require('./signup');
var facebook = require('./facebook');
var soundcloud = require('./soundcloud');
var beatport = require('./beatport');
var twitter = require('./twitter');
var youtube = require('./youtube');
var Account = require('../../models/Account');
module.exports = function(passport) {
  
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done){

        User.findById(id, function(err, user) {
            console.log('deserializing user: ', user);
            if(!user){
                Account.findById(id, function(er, usie){
                    console.log("deserializing account: ", usie);
                    if(usie) {
                        done(er, usie);
                    }
                })
            }else {

                done(err, user);
            }  
        });
    });
    
    login(passport);
    facebook(passport);
    soundcloud(passport);
    beatport(passport);
    twitter(passport);
    youtube(passport);
    signup(passport);
};
