var graph = require('fbgraph');
var functions = {};
var http = require('http');
var urls = require("../../model/urls");

functions.setToken = function (token) {
    graph.setAccessToken(token);
   // graph.setAppSecret("fc6df8828eed798d7e93aba2fc5b28c0");
}


functions.getGraph = function () {
    return graph;
}


//
functions.getPageAccess = function () {
    graph.batch([
        {
            method: "GET",
            relative_url: "me/accounts"// Get the current user's accounts
           
        }
    ], function (err, res) {

        var data = JSON.parse(res[0]["body"]);
        console.log(JSON.stringify(data))
        var pageToken = JSON.stringify(data["data"][0]["access_token"]);
        var pageId = JSON.stringify(data["data"][0]["id"]);
        var url = "";
        url += pageId.toString();
        url += "/feed?access_token=";
        url += pageToken.toString();
         console.log("myurl" + url.replace(/"/g, ""));
        urls.facebook = url.replace(/"/g, "");


    });
}

functions.postPage = function(message, url)
{
    // http.request({
    //     host: "graph.facebook.com",
    //     path: "223990914628734/feed",
    //     method: "POST",
    //     headers: {message: message, access_token: token}
    // }, function (response) {
    //     var str = '';
    //
    //     //another chunk of data has been recieved, so append it to `str`
    //     response.on('data', function (chunk) {
    //         console.log("http " + str);
    //     });
    //
    //     //the whole response has been recieved, so we just print it out here
    //
    //
    //
    // })

    graph.post(url, {message: message}, function(res){
        console.log("posted " + JSON.stringify(res));
    })
}




//     function setOpts(token) {
//     var options = {
//         host: "graph.facebook.com",
//         path: "/v2.6/" + token + "/feed",
//         method: "POST",
//         message: "hello"
//     }
// }
//  var myCallback = function(response) {
//         var str = ''
//         response.on('data', function (chunk) {
//             str += chunk;
//         });
//
//         response.on('end', function () {
//             console.log(str);
//         });
//     }
//
//     var req = http.request(options, myCallback);

    module.exports = functions;