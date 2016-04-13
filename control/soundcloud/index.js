//TODO: Cant make this work: seek help!!

var SoundCloudAPI = require("soundcloud-node");
var client_id = 'f744cb25a007c11da25cb45b805318a8';
var client_secret = 'e808cdc7373c8443f23ea84fa3f2e40c';
var redirect_uri = 'http://localhost/callback';

module.exports = function(req, res) {

// instantiate the client
    var client = new SoundCloudAPI(client_id, client_secret, redirect_uri);
    console.log("CUNT");
    oauthInit(req, res);
    oauthHandleToken(req, res);
}

// Connect User - Assuming you are using Express
    var oauthInit = function (req, res) {
        var url = client.getConnectUrl();
        console.log(url);
        res.writeHead(301 , url);
        res.end();
    };



// Get OAuth Token
// callback function from the connect url
    var oauthHandleToken = function (req, res) {
        var query = req.query;

        client.getToken(query.code, function (err, tokens) {
            if (err)
                callback(err);
            else {
                callback(null, tokens);
            }
        });
    };
