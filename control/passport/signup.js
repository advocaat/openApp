var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var bCrypt = require('bcrypt-nodejs');
module.exports = function (passport) {
    passport.use('signup', new LocalStrategy({
            passReqToCallback: true //allows us to pass back the entire request to the callback
        },
        function (req, username, password, done) {

            var findOrCreateUser = function () {
                //Find a user in Mongo with provided username
                User.findOne({'local.username': username}, function (err, user) {
                    //In case of any error, return using the done method
                    if (err) {
                        console.log('Error in Signup' + err);
                        return done(err, req.flash('signupMessage', 'Error in signup.'));
                    }
                    // User already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('signupMessage', 'User already exists.'));
                    } else {
                        // If there is no user with that email
                        // Create the user
                        var newUser = new User();
                        // Set the user's local credentials
                        newUser.local.username = username;
                        newUser.local.password = createHash(password);
                        // Save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in saving user: ' + err);
                                throw err;
                            }
                            console.log('User registration successful');
                            return done(null, false, req.flash('successMessage', 'User registration successful.'));
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));

    // Generate has using bCrypt
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
};