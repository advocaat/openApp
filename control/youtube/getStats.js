
var request = require('request');
var User = require('../../models/User');
var config = require('../../model/config');
var functions = {};
var youtubeUpload = require('youtube-upload');
var up = require('../../DAO/up')

//     let oauth = Youtube.authenticate({
//         type: "oauth",
//         client_id: config.youtube.clientID,
//         client_secret: config.youtube.clientSecret,
//         redirect_url: config.youtube.callbackURL
//     });
//
// oauth.generateAuthURL({
//     access_type: "offline",
//     scope:
//         'https://www.googleapis.com/auth/youtube',
//         'https://www.googleapis.com/auth/yt-analytics.readonly'
// });
var videoList = [];
var videoTitleList = [];
var counter = 0;
functions.retreiveStats = function(videoId){
    var countryList = [];
    var uri = "";
    countryList.push(['Country', 'Views']);
    User.findOne({"youtube.id": "UC4QDIq_Yw_jJG0ZhwcIzDWw"}, function(err, user){

        // uri += "https://www.googleapis.com/youtube/analytics/v1/reports?channel==MINE";
        // uri += "&dimensions==country&metrics==views&access_token=";
        uri += "https://www.googleapis.com/youtube/analytics/v1/reports?ids=channel==MINE&start-date=1990-01-01&end-date=2016-12-31&metrics=views&dimensions=country&filters=video==";
        uri += videoId;
        uri += "&access_token=";
        uri += user.youtube.access_token.toString();

        request(uri,{clientID:  config.youtube.clientID }, function(err, res, body){
            if(err)console.log("error "+ err);
            // console.log("body "+ JSON.parse(res.body)["rows"]);
            // console.log("res "+ JSON.stringify(res))
            // TODO: fix bug caused by this statement
            if(JSON.parse(res.body)["rows"]) {
                counter += 1;
                for (var i = 0; i < JSON.parse(res.body)["rows"].length -1; i++) {
                    console.log(JSON.parse(res.body)["rows"][i]);
                    countryList.push(JSON.parse(res.body)["rows"][i])
                }
                videoList.push(countryList);

            }
            //console.log("complete" + JSON.stringify(videoList));
        })
    })
}
functions.getVideoIDs = function(callback){
    var url = "";
    var songIds = [];
    User.findOne({"youtube.id":"UC4QDIq_Yw_jJG0ZhwcIzDWw" }, function(err, user){
        if(err){
            console.log("get tracks error "+ err)
        }
        if(user){
            url += "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UU4QDIq_Yw_jJG0ZhwcIzDWw&access_token=";
            url += user.youtube.access_token.toString();
        }
        request(url,{clientID:  config.youtube.clientID }, function(err, res, body){

            if(err){
                console.log("error "+ err);
            }else {
                // console.log(body);
                // console.log("body " + JSON.stringify(JSON.parse(res.body)["items"]["snippet"]["resourceId"]["videoId"]));
                //  console.log("res "+ JSON.stringify(res));
                JSON.parse(res.body)["items"].forEach(function(element){
                    // console.log("thing: "+ element.snippet.resourceId.videoId)
                    console.log("kjas "+ element.snippet.title);
                    videoTitleList.push(element.snippet.title);
                    songIds.push(element.snippet.resourceId.videoId);
                })
                console.log("songs length " + songIds.length)
                for(var i = 0; i < songIds.length; i++){
                // songIds.forEach(function(id){
                    functions.retreiveStats(songIds[i]);

                }
                setTimeout(function(){
                    callback(videoList, videoTitleList);
                }, 5000);
            }

        })
    })

}


functions.uploadVideo = function(videoId, title, description, keywords){

    up.saveFile(videoId, function(filename) {
        console.log("data "+ title+ " "+ description + " "+ keywords);
        var titleInside = title;
        var descriptionInside = description;
        var keywordsInside = keywords;
        User.findOne({'youtube.id': 'UC4QDIq_Yw_jJG0ZhwcIzDWw'}, function (err, user) {




                var filePath = __dirname + "\\..\\..\\" + filename;
                var title = titleInside;
                var description = descriptionInside;
                var category = 'Music';
                var keywords = keywordsInside;
                var googleAccessToken = user.youtube.access_token;
                var youtubeDeveloperKey = config.youtube.apiKey;
                youtubeUpload(filePath, title, description, category, keywords, googleAccessToken, youtubeDeveloperKey, false, false, function (err, youtube_id) {
                    if (err){
                        console.log("Got error: " + err);
                    }else{
                        console.log("Got id: " + youtube_id);
                    }

                });
            });

})

}


module.exports = functions;