var request = require('request');
var config = require('../../../model/config');
var User = require('../../../models/User');
var graph = require('../../../control/facebook/graph');
module.exports = function(token){

    var postBody = {};
    postBody.client_id = config.fb.clientID;
    postBody.client_secret = config.fb.clientSecret;
    postBody.grant_type = "fb_exchange_token";
    postBody.fb_exchange_token = token;

    var url = "https://graph.facebook.com/oauth/access_token";
    request.post({url: url, form: postBody}, function(err, res, body){
        console.log("returned "+ JSON.stringify(JSON.parse(JSON.stringify(res.body))));
        User.update({'local.username': 'bob'},{$set:{'local.facebook.access_token': JSON.stringify(JSON.parse(JSON.stringify(res.body))).split("=")[1].replace('\"','')}}, {multi: false}, function(err, status){
            if(err){
                console.log(err)
            }else{
                console.log("updater "+JSON.stringify(status))
                graph.setToken(JSON.stringify(JSON.parse(JSON.stringify(res.body))).split("=")[1].replace('\"',''));
                graph.getPageAccess();
            }
        })
    })
}