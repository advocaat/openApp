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
var upsc = require('../control/soundcloud/uploadSC');
var upfuncs = require('../DAO/up');

artists = require('../model/artists.js');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
var up = upfuncs.router(router);
module.exports = function (passport) {


    /* GET home page. */
    router.get('/', function (req, res, next) {

        res.render('index', {
            message: req.flash('loginMessage'),
            pageName: 'Open Records',
            pageDescription: 'Welcome Back'
        });
    });

    router.get('/upload', isAuthenticated, function (req, res, next) {

        res.render('upload', {pageName: 'Open Records', pageDescription: 'Upload Posts To Selected Channels'});
    });

    router.get('/signup', isAuthenticated, function (req, res) {
        res.render('signUp', {pageName: 'Signup', pageDescription: 'for testing'});
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


    router.get("/tracker", isAuthenticated, function (req, res, next) {
        res.render("piracy", {pageName: 'Pirate Tracer', pageDescription: 'View results of pirate tracking thingy'});
    })


    // router.get("/callback", isAuthenticated,function(req, res){
    //     res.render('callback');
    // });

    // router.get("/modelUpdates", function(req, res){
    //    res.send(JSON.stringify({items: model.getModel(), length: model.getUploadsLength()}));
    //    
    // });

    router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['manage_pages', 'publish_pages']}));
        

    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/upload',
            failureRedirect: '/'
        }));

    router.get('/auth/soundcloud',
        passport.authenticate('soundcloud'));

    router.get('/auth/soundcloud/callback',
        passport.authenticate('soundcloud', {failureRedirect: '/return'}),
        function (req, res) {
            console.log("the code" + req.query.code)
            urls.soundcloud_code = req.query.code;
            res.redirect('/upload');
        });

    router.get("/return", function (req, res) {
        res.render("killpage");
    });

    router.get('/upload/sc', isAuthenticated, function (req, res) {
        console.log("a user " + req.user);
        res.redirect('http://localhost:3000/upload');
    })
    0
    router.get('/beatport', function (req, res) {
        artists.forEach(function (artist) {
            console.log(artist.artistid);
            beatport.getByArtist(artist.artistid);
        })
        res.redirect('/')
    })

    router.get('/stats', function (req, res) {
        var data = [];
        DAO.pullStats(function (stats) {
            console.log("pooper " + stats)
            statsData.buildGraphObject(stats, function (graph) {
                //data.push[graph];
                res.render('graph', {
                    graphy: JSON.stringify(graph),
                    pageName: 'Statistics',
                    pageDescription: 'Statistics generated from services'
                });
            });
        })

    })

    router.get('/auth/beatport',
        passport.authenticate('beatport'));


    router.get('/auth/beatport/callback',
        passport.authenticate('beatport', {failureRedirect: '/login'}),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    router.get('/auth/twitter', passport.authenticate('twitter'));

    router.get('/auth/twitter/callback', passport.authenticate('twitter',
        { successRedirect: '/upload',
            failureRedirect: '/login' }
        )
    );
    router.get('/auth/youtube',
        passport.authenticate('youtube'));


    router.get('/auth/youtube/callback', passport.authenticate('youtube',{ successRedirect: '/upload',
            failureRedirect: '/pooped'}),
        function(req, res){
            console.log("the code"+req.query.code);
            res.redirect('/');
        });

    
    router.get('/accounts', function(req, res){
        res.render('accounts', {pageName: "dsds", pageDescription: "asddsasd"});
            
    })


    router.post('/accounts/add', passport.authenticate('signup',
        { successRedirect: '/accounts',
            failureRedirect: '/'
          
        }))


    return router;
}


function redirectHandler(req, res) {

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

router.get('/cunt', function(req, res){

    upsc.uploadMongo("track", "5718a039f7cf2c0c2cf8ccf5","listy","sljkhdjs","disco");
    //upfuncs.getFile("5718a039f7cf2c0c2cf8ccf5", function(stream){
    //upsc.uploadTrack("track", "5718a039f7cf2c0c2cf8ccf5","listy","sljkhdjs","disco");
    //});

    res.send("ok");

});

router.get('/playlists', function(req, res){
    upfuncs.getPlaylists();

    res.send("cunt");
})
