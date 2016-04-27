var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var soundcloud = require('../control/soundcloud');
var model = require('../model/uploads');
var graph = require('../control/facebook/graph');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
var up = require('../DAO/up')(router);
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
        
        router.get("/modelUpdates", function(req, res){
           res.send(JSON.stringify({items: model.getModel(), length: model.getUploadsLength()}));
            
        });

        router.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'publish_actions'] }));

        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', { successRedirect: '/upload',
                failureRedirect: '/' }));


        router.get('/testy', function(req, res){
            graph.getPageAccess();
            // graph.post("/feed", {message: "server log in"}, function (err, res) {
            //     console.log(res);
            //
            // })



            //    

            res.redirect('/upload');

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
