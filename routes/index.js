var express = require('express');
var router = express.Router();
var formidable = require('formidable');


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

    module.exports = function (passport) {
        /* GET home page. */
        router.get('/', function (req, res, next) {

            res.render('index', {message: req.flash('loginMessage'), pageName: 'Open Records', pageDescription: 'Login'});
        });

        router.get('/upload',isAuthenticated, function (req, res, next) {
            res.render('upload', {pageName: 'Open Records', pageDescription: 'Login'});
        });

        router.get('/signup', function (req, res) {
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
        router.get("/stats", function(req, res, next){
            res.render("stats", {pageName: 'Statistics', pageDescription: 'view statistics generated from services'});
        });
        
        
        router.get("/tracker", function(req, res, next){
            res.render("piracy", {pageName: 'Pirate Tracer', pageDescription: 'View results of pirate tracking thingy'});
        })

        return router;
    }

