
window.fbAsyncInit = function() {
    FB.init({
        appId      : '131165413948189',
        xfbml      : true,
        version    : 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



    //post message to page
var body = 'Reading JS SDK documentation';
FB.api('/me/feed', 'post', { message: body }, function(response) {
    if (!response || response.error) {
        alert('Error occured');
    } else {
        alert('Post ID: ' + response.id);
    }
});

//login
FB.login(function(response) {
    if (response.authResponse) {
        var access_token =   FB.getAuthResponse()['accessToken'];
        console.log('Access Token = '+ access_token);
        FB.api('/me', function(response) {
            console.log('Good to see you, ' + response.name + '.');
        });
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
}, {scope: ''});

