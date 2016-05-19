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

functions.postPage = function(message, url) {
    graph.post(url, {message: message}, function(err, res){
        console.log("posted " + JSON.stringify(res));
    })
}


module.exports = functions;