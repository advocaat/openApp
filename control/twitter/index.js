var twitter = require('twit');
var config = require("../../model/config.js");
var User = require("../../models/User.js");

module.exports = function(post) {
    User.findOne({"twitter.id": "4443966677"}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            console.log("user " + JSON.stringify(user));
            console.log("user acess token" + user.access_token)
            var client = new twitter({
                consumer_key: config.twitter.apiKey,
                consumer_secret: config.twitter.apiSecret,
                access_token: user.twitter.access_token,
                access_token_secret: user.twitter.access_token_secret

            })


            client.post('statuses/update', {status: post}, function (err, data, response) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(data)
                }
            })
        } else {
            console.log("no use");
        }

    });
}