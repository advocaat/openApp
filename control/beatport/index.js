var request = require('request');
var config = require('../../model/config');
var User = require('../../models/User');
functions = {};


var OAuth = require('oauth').OAuth;
var oa = new OAuth("https://oauth-api.beatport.com/catalog/3/search/",
    "https://oauth-api.beatport.com/catalog/3/search/",
    config.beatport.apiKey, config.beatport.apiSecret,
    "1.0A", undefined, "HMAC-SHA1");


functions.getByArtist = function(){

    User.findOne({"beatport.id": "6273959" }, function(err, data){
        if(err){
            console.log(err);
        }else{
            console.log(JSON.stringify(data));
            var url = 'https://oauth-api.beatport.com/catalog/3/artists/detail?id=226384';
            console.log(data.beatport.access_token + " "+data.beatport.access_token_secret);
            var request = oa.get(url, config.beatport.accessToken, config.beatport.accessTokenSecret, function(error, data) {
                if (error) {
                    console.log(error);
                } else {
                    JSON.parse(data).results.topDownloads.forEach(function (download) {
                        console.log("id: "+ download.id + " name "+ download.name +" charts "+ JSON.stringify(download.charts));
                    })
                    //console.log(JSON.parse(data).results);
                }
            });



            // request('https://oauth-api.beatport.com/catalog/3/search/?query=Symphonica&facets=artistName:Nicky Romero?access_token='+ data.beatport.access_token+';access_token_secret='+ data.beatport.access_token_secret, function(err, data){
            //     if(err){
            //         console.log("errorrr"+ err);
            //     }else {
            //         console.log("autheticated " + JSON.stringify(data));
            //     }
            // })


        }

    })

}

module.exports = functions;