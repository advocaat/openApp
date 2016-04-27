var graph = require('fbgraph');
var functions = {};



functions.setToken = function (token) {
    graph.setAccessToken(token);
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

        console.log("page" + pageId + pageToken);
        var myUrl = pageId + "/feed?access_token=" + pageToken;
        graph.post(myUrl ,{message: "login"}, function(err, res) {
            // returns the post id
            console.log("pez"+ JSON.stringify(res)); // { id: xxxxx}
        });

    });
}


module.exports = functions;