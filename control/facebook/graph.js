var graph = require('fbgraph');
var functions = {};
var http = require('http');
var urls = require("../../model/urls");
var up = require('../../DAO/up');
var removeFiles = require('../../model/uploads/removeFiles');
var fs = require('fs');
var request = require('request');
var User = require('../../models/User');
functions.setToken = function (token) {
    graph.setAccessToken(token);
   // graph.setAppSecret("fc6df8828eed798d7e93aba2fc5b28c0");
}

functions.getGraph = function () {
    return graph;
}

// functions.buildAlbumString = function() {
//     graph.batch({
//         method: "GET",
//         relative_url: "me/accounts"
//
//     }, function (err, res) {
//         var data = JSON.parse(res[0]["body"]);
//         console.log(JSON.stringify(data))
//         var pt = JSON.stringify(data["data"][0]["access_token"]);
//         albumUploadString += pt;
//         console.log("post url " +albumUploadString);
//     })
// }
functions.getPageAccess = function () {
    graph.batch([
        {
            method: "GET",
            relative_url: "me/accounts"// Get the current user's accounts
        }
    ], function (err, res) {
        if(err){console.log(JSON.stringify(err));}
        
        var data = JSON.parse(res[0]["body"]);
        console.log(JSON.stringify(data))
        User.update({'local.username': 'bob'},{$set:{"local.facebook.page_token": data["data"][0]["access_token"], 'local.facebook.page_id':data["data"][0]["id"] }},function(err,status){
           if(err){
               console.log("fberr "+ err)
           }else{
               console.log("fbupdated "+ status);
           }
        });
        var pageToken = JSON.stringify(data["data"][0]["access_token"]);
        var pageId = JSON.stringify(data["data"][0]["id"]);
        var url = "";
        var photoUrl = "";
        url += pageId.toString();
        url += "/feed?access_token=";
        url += pageToken.toString();
        photoUrl += pageId.toString();
        photoUrl += "/albums?access_token=";
        photoUrl += pageToken.toString();

         console.log("myurl" + url.replace(/"/g, ""));
        urls.facebook = url.replace(/"/g, "");
        urls.facebook_photo = photoUrl.replace(/"/g,"");
    });
}

functions.postPage = function(message) {
    graph.post(urls.facebook, {message: message}, function(err, res){
        console.log("posted " + JSON.stringify(res));
    })
}

functions.postPageWithPhoto = function(message, photoId){

    graph.post(urls.facebook, {message: message, object_attachment: photoId}, function(err, res){
        console.log("posted " + JSON.stringify(res));

    });

}
var albumId;
   var albumUploadString = "";
   functions.getAlbums = function(callback){
       
        // graph.batch({
        //     method: "GET",
        //     relative_url: "me/accounts"//
        //
        // })
       try {
           console.log("url " + urls.facebook_photo);
           var albums = graph.get(urls.facebook_photo, function (err, res) {

               console.log("data " + JSON.stringify(res.data[0]));
               albumId = res.data[0].id;

               albumUploadString += albumId.toString();
               albumUploadString += "/photos?access_token=";
               albumUploadString += urls.facebook_photo.split("=")[1].toString();
               console.log("ljdnh " + albumUploadString);
           });
       }catch(err){
           console.log('err '+ err);
       }

            callback();
   }


functions.postPhoto = function(mongoId, msg){
    functions.getPageAccess();
    var access_token = urls.facebook.split("=")[1],
        pageid = 'me',
        fburl = 'https://graph.facebook.com/v2.1/'
            + pageid
            + '/photos?access_token='
            + access_token,
        req,
        form;

        req = request.post(fburl, function(err, res, body) {
        if (err)
            return console.error('Upload failed:', err);
        console.log('Upload successful! Server responded with:', body);
    });
    form = req.form();
// append a normal literal text field ...
   // form.append('message', 'My photo!');

// append a file field by streaming a file from disk ...
    form.append('source',  request("http://localhost:3000/up/file/" + mongoId));
    console.log("message " + msg);
    form.append('message', msg);

}


   function streamToString(stream, cb) {
       const chunks = [];
       stream.on('data', function(chunk){
           chunks.push(chunk.toString());
   });
       stream.on('end', function(){
           cb(chunks.join(''));
   });
   }

module.exports = functions;