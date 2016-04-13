var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var  soundcloud = require('../control/soundcloud');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

    module.exports = function (passport) {
        /* GET home page. */
        router.get('/', function (req, res, next) {

            res.render('index', {message: req.flash('loginMessage'), pageName: 'Open Records', pageDescription: ''});
        });

        router.get('/upload',isAuthenticated, function (req, res, next) {

            res.render('upload', {pageName: 'Open Records', pageDescription: 'Upload Posts To Selected Channels'});
        });

        router.get('/signup',isAuthenticated, function (req, res) {
            res.render('signUp',{pageName: 'Signup', pageDescription: 'for testing'});
        });


        router.post('/signup', passport.authenticate('signup', {
            successRedirect: '/login',
            failureRedirect: '/',
            failureFlash: true
        }));

        router.post('/', passport.authenticate('login', {
            successRedirect: '/upload',
            failureRedirect: '/',
            failureFlash: true
        }));
        router.get("/stats", isAuthenticated,function(req, res, next){
            res.render("stats", {pageName: 'Statistics', pageDescription: 'view statistics generated from services'});
        });
        
        
        router.get("/tracker",isAuthenticated ,function(req, res, next){
            res.render("piracy", {pageName: 'Pirate Tracer', pageDescription: 'View results of pirate tracking thingy'});
        })


        router.get("/callback", isAuthenticated,function(req, res){
            res.render('callback');
        });

        return router;


    }


    function redirectHandler(req, res)
    {
        var code = req.query.code;
            console.log("soundcloud code " + code);
            SC.authorize(code, function(err, accessToken) {
                if ( err ) {
                    throw err;
                } else {
                    // Client is now authorized and able to make API calls
                    console.log('access token:', accessToken);
                }
            });

    }
