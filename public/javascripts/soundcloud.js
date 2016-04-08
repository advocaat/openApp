
//<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js"></script>
    SC.initialize({
        client_id: 'YOUR_CLIENT_ID',
        redirect_uri: 'http://example.com/callback'
    });

// initiate auth popup
SC.connect().then(function() {
    return SC.get('/me');
}).then(function(me) {
    alert('Hello, ' + me.username);
});
