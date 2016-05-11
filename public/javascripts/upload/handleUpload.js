
$("#upload").on("click", function () {
    
    var facebook = {};
    var soundcloud = {};
    var youtube = {};
    
    facebook.message = "";
    facebook.images = [];
    soundcloud.message = "";
    soundcloud.images = [];
    soundcloud.audio;
    youtube.message = "";
    youtube.images = [] ;
    
    myBlocks.forEach(function(block){
        if(block.platforms.indexOf("facebook") > -1) {
            switch (block.option) {
                case "text":
                    facebook.message += block.content + "\n";
                    break;
                case "image":
                    facebook.images.push(block.imageId);
                    break;
            }
        }
        if(block.platforms.indexOf("soundcloud") > -1){
            switch (block.option) {
                case "text":
                    soundcloud.message += block.content + "\n";
                    break;
                case "image":
                    soundcloud.images.push(block.imageId);
                    break;
                case "audio":
                    var reader = new FileReader(block.audioFile);
                    var buf = reader.readAsArrayBuffer();

                    soundcloud.audio = new Blob(buf, { type: 'audio/mp3'});

            }

        }
        if(block.platforms.indexOf("youtube") > -1){
            switch (block.option) {
                case "text":
                    youtube.message += block.content + "\n";
                    break;
                case "image":
                    youtube.images.push(block.imageId);
                    break;
            }
        }
    })

    // console.log("facebook: " + facebookMessage + "images: " + facebookImages.toString());
    // console.log("soundcloud: " + soundcloudMessage + "images: " + soundcloudImages.toString());
    // console.log("youtube: " + youtubeMessage + "images: " + youtubeImages.toString())
    // uploadFacebook("hello from the client");
    //
    //
    
 
    var socket = io('http://localhost:3000');
    console.log("emitting");
    socket.emit("facebook", facebook);
    socket.emit("youtube", youtube);
    socket.emit("soundcloud", soundcloud);
    
})
