
//<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js"></script>
    SC.initialize({
        client_id: 'f744cb25a007c11da25cb45b805318a8',
        clientSecret: "e808cdc7373c8443f23ea84fa3f2e40c",
        redirect_uri: 'http://localhost//auth/soundcloud/callback'
    });

// initiate auth popup
SC.connect().then(function() {
    return SC.get('/me');
}).then(function(me) {
    alert('Hello, ' + me.username);
});


function upload(blob, name){
    SC.upload({
        file: blob, // a Blob of your WAV, MP3...
        title: name
    });
    console.log("uploading");
}