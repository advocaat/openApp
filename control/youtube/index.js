//var config = require('../../model/config');
//var User = require('../../models/User');
//functions = {};
//
//var OAUTH2_CLIENT_ID = config.youtube.clientID;
//var OAUTH2_SCOPES = "https://www.googleapis.com/auth/youtube";
//
//var OAuth = require("oauth").OAuth;
//var oa = new OAuth("https://accounts.google.com/o/oauth2/auth?"
//    + "client_id=" + config.youtube.clientID
//    + "&redirect_uri=" + config.youtube.callbackURL
//    + "&scope=" + OAUTH2_SCOPES
//    + "&response_type=code&"
//    + "access_type=offline");
//
//functions.googleApiClientReady = function(passport) {
//
//    gapi.auth.init(function() {
//        window.setTimeout(checkAuth, 1);
//    });
//};
//
//
//functions.checkAuth = function() {
//    gapi.auth.authorize({
//        client_id: OAUTH2_CLIENT_ID,
//        scope: OAUTH2_SCOPES,
//        immediate: true
//    }, handleAuthResult);
//};
//
//functions.handleAuthResult = function(authResult) {
//    if (authResult && !authResult.error) {
//        $('.pre-auth').hide();
//        $('.post-auth').show();
//        loadAPIClientInterfaces();
//    } else {
//        $('#login-link').click(function() {
//            gapi.auth.authorize({
//                client_id: OAUTH2_CLIENT_ID,
//                scope: OAUTH2_SCOPES,
//                immediate: false
//            }, handleAuthResult);
//        });
//    }
//};
//
//functions.loadAPIClientInterfaces = function() {
//    gapi.client.load('youtube', 'v3', function() {
//        handleAPILoaded();
//    });
//};
//
//module.exports = functions;

var Strategy = require('./strategy');

exports.Strategy = Strategy;