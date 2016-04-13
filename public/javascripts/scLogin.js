
//<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js"></script>
    SC.initialize({
        client_id: 'f744cb25a007c11da25cb45b805318a8',
        redirect_uri: 'http://localhost/callback'
    });

// initiate auth popup
SC.connect().then(function() {
    return SC.get('/me');
}).then(function(me) {
    alert('Hello, ' + me.username);
});


function upload(blob){
    SC.upload({
        file: blob, // a Blob of your WAV, MP3...
        title: 'test'
    });

}