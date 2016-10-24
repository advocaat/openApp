var request = require('request');
var config = require('../../../model/config');
var User = require('../../../models/User');

module.exports = function(token) {

    var postBody = {};
    postBody.client_id = config.youtube.clientID;
    postBody.client_secret = config.youtube.clientSecret;
    postBody.grant_type = "refresh_token";
    postBody.refresh_token = token;

    var url = "https://accounts.google.com/o/oauth2/token";
    try {
        request.post({url: url, form: postBody}, function (err, res, body) {
            console.log("returned " + JSON.stringify(res));
            console.log("then " + JSON.parse(res.body)["refresh_token"]);
            User.update({'youtube.refresh_token': token}, {
                $set: {
                    'youtube.access_token': JSON.parse(res.body)["access_token"],
                    'youtube.expires_in': new Date().getTime() + (parseInt(JSON.parse(res.body)["expires_in"]) * 1000)
                }
            }, {multi: false}, function (err, status) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("updater " + JSON.stringify(status))
                }
            })
        })
    } catch (err) {
        console.log(err);
    }
}