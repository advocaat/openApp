var date;

$('#datetimepicker1').datetimepicker().on('dp.change', function(e){
    date = new Date(e.date).toUTCString();
    console.log(date);
})

var socket = io('http://localhost:3000');
$("#upload").on("click", function () {
    if(date == null || date <= new Date().getTime()) {
        date = new Date() + 10000;
    }
        var facebook = {};
        var soundcloud = {};
        var youtube = {};
        var twitter = {};
        facebook.schedule = date;
        facebook.message = "";
        facebook.images = [];
        facebook.update = false;
        soundcloud.schedule = date;
        soundcloud.message = "";
        soundcloud.images = [];
        soundcloud.fileId;
        soundcloud.update = false;
        youtube.schedule = date;
        youtube.message = "";
        youtube.images = [];
        youtube.update = false;
        twitter.schedule = date;
        twitter.message = "";
        twitter.update = false;
        
    
        myBlocks.forEach(function (block) {
            if (block.platforms.indexOf("facebook") > -1) {
                facebook.update = true;
                switch (block.option) {
                    case "text":
                        facebook.message += block.content + "\n";
                        break;
                    case "image":
                        facebook.images.push(block.imageId);
                        break;
                }
            }
            if (block.platforms.indexOf("soundcloud") > -1) {
                soundcloud.update = true;
                switch (block.option) {
                    //case "text":
                    //    soundcloud.message += block.content + "\n";
                    //    break;
                    //case "image":
                    //    soundcloud.images.push(block.imageId);
                    //    break;
                    case "audio":
                        soundcloud.fileId = block.imageId;
                        soundcloud.title = $('#songTitle').val();
                        soundcloud.description = $('#description').val();
                        soundcloud.playlist = $('#playlist').val();
                        soundcloud.genre = $('#genre').val();
                        break;
                }
            }

            if (block.platforms.indexOf("youtube") > -1) {
                youtube.update = true;
                switch (block.option) {
                    case "text":
                        youtube.message += block.content + "\n";
                        break;
                    case "image":
                        youtube.images.push(block.imageId);
                        break;
                }
            }
            if (block.platforms.indexOf("twitter") > -1) {
                twitter.update = true;
                switch (block.option) {
                    case "text":
                        twitter.message += block.content + "\n";
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

    console.log("emitting");
    if(facebook.update) {
        socket.emit("facebook", facebook);
    }
    if(youtube.update) {
        socket.emit("youtube", youtube);
    }
    
    if(soundcloud.update) {
        socket.emit("soundcloud", soundcloud);
    }
    if(twitter.update) {
        console.log("twitter message " + twitter.message);
        socket.emit("twitter", twitter);
    }
})
