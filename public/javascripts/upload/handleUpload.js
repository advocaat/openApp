
$("#upload").on("click", function () {

    var facebookMessage = "";
    var facebookImages = [];
    var soundcloudMessage = "";
    var soundcloudImages = [];
    var youtubeMessage = "";
    var youtubeImages = [] ;

    myBlocks.forEach(function(block){
        if(block.platforms.indexOf("facebook") > -1) {
            switch (block.option) {
                case "text":
                    facebookMessage += block.content + "\n";
                    break;
                case "image":
                    facebookImages.push(block.imageId);
                    break;
            }
        }
        if(block.platforms.indexOf("soundcloud") > -1){
            switch (block.option) {
                case "text":
                    soundcloudMessage += block.content + "\n";
                    break;
                case "image":
                    soundcloudImages.push(block.imageId);
                    break;
            }

        }
        if(block.platforms.indexOf("youtube") > -1){
            switch (block.option) {
                case "text":
                    youtubeMessage += block.content + "\n";
                    break;
                case "image":
                    youtubeImages.push(block.imageId);
                    break;
            }
        }
    })

    console.log("facebook: " + facebookMessage + "images: " + facebookImages.toString());
    console.log("soundcloud: " + soundcloudMessage + "images: " + soundcloudImages.toString());
    console.log("youtube: " + youtubeMessage + "images: " + youtubeImages.toString())
    uploadFacebook("hello from the client");
})
