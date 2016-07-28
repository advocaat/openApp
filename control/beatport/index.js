var request = require('request');
var config = require('../../model/config');
var User = require('../../models/User');
functions = {};


var OAuth = require('oauth').OAuth;
var oa = new OAuth("https://oauth-api.beatport.com/catalog/3/search/",
    "https://oauth-api.beatport.com/catalog/3/search/",
    config.beatport.apiKey, config.beatport.apiSecret,
    "1.0A", undefined, "HMAC-SHA1");


functions.getByArtist = function(id){

    User.findOne({"beatport.id": "6273959" }, function(err, data){
        if(err){
            console.log(err);
        }else{
            console.log(JSON.stringify(data));
            var url = 'https://oauth-api.beatport.com/catalog/3/artists/detail?id='+ id;
            console.log(data.beatport.access_token + " "+data.beatport.access_token_secret);
            var request = oa.get(url, config.beatport.accessToken, config.beatport.accessTokenSecret, function(error, data) {
                if (error) {
                    console.log(error);
                } else {
                    JSON.parse(data).results.featuredReleases.forEach(function(release){
                        console.log(release)
                    })
                    // JSON.parse(data).results.topDownloads.forEach(function (download) {
                    //     console.log("id: "+ download.id + " name "+ download.name +" charts "+ JSON.stringify(download.charts));
                    // })
                    //console.log(JSON.parse(data).results);
                }
            });
            
        }

    })

}

module.exports = functions;