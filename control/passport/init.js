var User = require('../../models/user');
var login = require('./login');
var signup = require('./signup');
var facebook = require('./facebook');
var soundcloud = require('./soundcloud');
var beatport = require('./beatport');

module.exports = function(passport) {
  
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });
    
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });
    
    login(passport);
    facebook(passport);
    soundcloud(passport);
    beatport(passport);
    signup(passport);
};
