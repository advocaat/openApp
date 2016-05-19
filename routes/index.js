var express = require('express');
var router = express.Router();
var formidable = require('formidable');
//var soundcloud = require('../control/passport/soundcloud');
//var model = require('../model/oldUploads');
var graph = require('../control/facebook/graph');
var SC = require('../control/soundcloud');
var urls = require('../model/urls');
var DAO = require('../DAO');
var statsData = require('../control/soundcloud/graphItemBuilder');
var client;
var beatport = require('../control/beatport');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
var up = require('../DAO/up').router(router);
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

        


        router.get("/tracker",isAuthenticated ,function(req, res, next){
            res.render("piracy", {pageName: 'Pirate Tracer', pageDescription: 'View results of pirate tracking thingy'});
        })


        // router.get("/callback", isAuthenticated,function(req, res){
        //     res.render('callback');
        // });
        
        // router.get("/modelUpdates", function(req, res){
        //    res.send(JSON.stringify({items: model.getModel(), length: model.getUploadsLength()}));
        //    
        // });

        router.get('/auth/facebook', passport.authenticate('facebook',{ scope: ['manage_pages', 'publish_pages'] }));



        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', { successRedirect: '/upload',
                failureRedirect: '/' }));
        
        router.get('/auth/soundcloud',
            passport.authenticate('soundcloud'));
        
        router.get('/auth/soundcloud/callback',
            passport.authenticate('soundcloud',{ failureRedirect: '/pooped'}),
        function(req, res){
            console.log("the code"+req.query.code)
            urls.soundcloud_code = req.query.code;
            res.redirect('/upload');
        });

        router.get("/pooped", function(req, res){
            res.render("killpage");
            
        });
        
router.get('/upload/sc', isAuthenticated, function(req, res){
    console.log("a user "+ req.user);

    res.redirect('http://localhost:3000/upload');

})
        router.get('/fb', function(req, res){
            graph.postPage("jhjdhd", urls.facebook);
            res.redirect('/upload');
        });

        router.get('/sc', function(req, res){
           SC.authorizeSC();
           SC.getTracks(function(tracks){
               SC.getTrackData(tracks);
           });
            res.redirect('/upload');
        })

router.get('/scdata', function(req, res){
    DAO.pullStats(function(stats){
        console.log("poop "+ stats)
    })

    res.redirect('/upload')
})

router.get('/beatport', function(req, res){
    beatport.getByArtist();
    res.redirect('/')

})

router.get('/stats', function(req, res){
    var data = [];
    DAO.pullStats(function(stats){
        console.log("pooper "+ stats)
        statsData.buildGraphObject(stats, function(graph){
            //data.push[graph];
            res.render('graph',  {graphy: JSON.stringify(graph), pageName: 'Statistics', pageDescription: 'view statistics generated from services'});
        });
    })
    
})

        router.get('/auth/beatport',
            passport.authenticate('beatport'));

        
        
        router.get('/auth/beatport/callback',
            passport.authenticate('beatport', { failureRedirect: '/login' }),
            function(req, res) {
                // Successful authentication, redirect home.
                res.redirect('/');
            });

        return router;
    }


    function redirectHandler(req, res)
    {

        // var code = req.query.code;
        //     console.log("soundcloud code " + code);
        //     SC.authorize(code, function(err, accessToken) {
        //         if ( err ) {
        //             throw err;
        //         } else {
        //             // Client is now authorized and able to make API calls
        //             console.log('access token:', accessToken);
        //         }
        //     });

    }
