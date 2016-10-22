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
var ytfuncs = require('../control/youtube/getStats');
artists = require('../model/artists.js');
var reauth = require('../control/passport/reauthentication/soundcloud');
var reauthYt = require('../control/passport/reauthentication/youtube');
var reauthFb = require('../control/passport/reauthentication/facebook');
var User = require('../models/User');
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
        successRedirect: '/auth/facebook',
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
            successRedirect: '/auth/youtube',
            failureRedirect: '/'
        }));

    router.get('/auth/soundcloud',
        passport.authenticate('soundcloud'));

    router.get('/auth/soundcloud/callback',
        passport.authenticate('soundcloud', { successRedirect: '/auth/twitter', failureRedirect: '/return'}));
        // function (req, res) {
        //     console.log("the code" + res.query.code)
        //     urls.soundcloud_code = res.query.code;
        //     res.redirect('/upload');
        // }));

    router.get("/return", function (req, res) {
        res.render("killpage");
    });

    router.get('/upload/sc', isAuthenticated, function (req, res) {
        console.log("a user " + req.user);
        res.redirect('http://localhost:3000/upload');
    })
    
    router.get('/beatport', function (req, res) {
        artists.forEach(function (artist) {
            console.log(artist.artistid);
            beatport.getByArtist(artist.artistid);
        })
        res.redirect('/')
    })

    router.get('/stats/:graph', function (req, res) {
        var graphOption = req.params.graph;
        console.log("parameter " + graphOption);
        var data = [];
        switch(graphOption.toString().trim()) {
            case "graph1":
            DAO.pullStats(function (stats) {
                    console.log("qwqewqw");
                    statsData.buildGraphObject(stats, function (graph) {
                        //data.push[graph];
                        res.render('graph1', {
                            graphy: JSON.stringify(graph),
                            // locationViews: "[]",
                            pageName: 'Statistics',
                            pageDescription: 'Statistics generated from services'
                        });
                    });
                })
                break;
            case "graph2":
                DAO.getYoutubeViews(function(data){
                    res.render('graph2',{
                        graphy: "[]",
                        videoTitles: JSON.stringify(data.titleArray),
                        locationViews: JSON.stringify(data.dataArray),
                        pageName: 'Statistics',
                        pageDescription: 'Statistics generated from services'
                    })
                });
                break;

            case "graph3":
                DAO.getYoutubeViews(function(data){
                    res.render('graph3',{
                        graphy: "[]",
                        videoTitles: JSON.stringify(data.titleArray),
                        locationViews: JSON.stringify(data.dataArray),
                        pageName: 'Statistics',
                        pageDescription: 'Statistics generated from services'
                    })
                });
                break;
        }
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
            failureRedirect: '/login'
        }));

    router.get('/auth/youtube', passport.authenticate('youtube'));


    router.get('/auth/youtube/callback',
            passport.authenticate('youtube',{successRedirect: '/auth/soundcloud', failureRedirect: '/login'}));


    
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

    //upsc.uploadMongo("track", "5718a039f7cf2c0c2cf8ccf5","listy","sljkhdjs","disco");
    //upfuncs.getFile("5718a039f7cf2c0c2cf8ccf5", function(stream){
    //upsc.uploadTrack("track", "5718a039f7cf2c0c2cf8ccf5","listy","sljkhdjs","disco");
    //});
    try {
        // ytfuncs.getVideoIDs(function(data, titles){
        //     DAO.insertRegionViews(data, titles);
        //
        // })
        User.findOne({'local.username': 'bob'}, function(err, data){
            console.log("rtoken " + data.local.facebook.access_token);
            // reauth(data.soundcloud.refresh_token);
            // reauthYt(data.youtube.refresh_token);
            reauthFb(data.local.facebook.access_token);
        })


    }catch(err){
        console.log("mine error" +err);

    }
    res.send("ok");

});

router.get('/playlists', function(req, res){
    upfuncs.getPlaylists();

    res.send("cunt");
})
