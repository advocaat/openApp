var request = require('request');
var config = require('../../../model/config');
var User = require('../../../models/User');

module.exports = function(token){

    var postBody = {};
    postBody.client_id = config.soundcloud.clientID;
    postBody.client_secret = config.soundcloud.clientSecret;
    postBody.grant_type = "refresh_token";
    postBody.refresh_token = token;

    var url = "https://api.soundcloud.com/oauth2/token";
    request.post({url: url, form: postBody}, function(err, res, body){
        console.log("scheduled function returned "+ JSON.stringify(res));
        User.update({'soundcloud.refresh_token': token},{$set:{'soundcloud.access_token': JSON.parse(res.body)["access_token"], 'soundcloud.refresh_token': JSON.parse(res.body)["refresh_token"], 'soundcloud.expires_in': new Date().getTime() + (parseInt(JSON.parse(res.body)["expires_in"])*1000)}}, {multi: false}, function(err, status){
            if(err){
                console.log(err)
            }else{
                console.log("updater "+JSON.stringify(status))
            }
        })
    })
}