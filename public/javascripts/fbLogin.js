FB.init({
    appId: '991475010939147',
    xfbml: true,
    version: 'v2.5'
});

function uploadFacebook(message) {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));


    FB.login(function (response) {
        if (response.authResponse) {
            var access_token = FB.getAuthResponse()['accessToken'];
            console.log('Access Token = ' + access_token);
            FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');
            });

            
            function submitFBPost(callback) {
                FB.api("/me/accounts", function (response) {
                    var get = {};
                    console.log("PAGE ID!!!"+ response["data"][0]["id"] + "ACCESS TOKEN "+ response["data"][0]["access_token"]);
                    get.url = response["data"][0]["id"] + "/feed";
                    get.access = response["data"][0]["access_token"];
                    callback(get);
                });
            }

            submitFBPost(function (get) {
                FB.api(get.url, 'post', {message: message, access_token: get.access}, function (response) {
                    if (!response || response.error) {
                        console.log(JSON.stringify(response));
                    } else {
                        alert('Post ID: ' + response.id);
                    }
                });
            })

        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'manage_pages, publish_actions'});

}