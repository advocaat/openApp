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
        facebook.schedule = date;
        facebook.message = "";
        facebook.images = [];
        soundcloud.schedule = date;
        soundcloud.message = "";
        soundcloud.images = [];
        soundcloud.audio;
        youtube.schedule = date;
        youtube.message = "";
        youtube.images = [];

        myBlocks.forEach(function (block) {
            if (block.platforms.indexOf("facebook") > -1) {
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

                        soundcloud.audio = new Blob(buf, {type: 'audio/mp3'});

                }

            }
            if (block.platforms.indexOf("youtube") > -1) {
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


        console.log("emitting");
        socket.emit("facebook", facebook);
        socket.emit("youtube", youtube);
        socket.emit("soundcloud", soundcloud);

})
