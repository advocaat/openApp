var signinCallback = function (result) {
    if (result.access_token) {
        var uploadVideo = new UploadVideo();
        uploadVideo.ready(result.access_token);
    }
};

var STATUS_POLLING_INTERVAL_MILLIS = 60 * 1000; // One minute.
authenticated = true;

var UploadVideo = function () {

    this.tags = ['youtube-cors-upload'];

    this.categoryId = 22;
    this.videoId = '';

    this.uploadStartTime = 0;
};


UploadVideo.prototype.ready = function (accessToken) {
    this.accessToken = accessToken;
    this.gapi = gapi;
    this.authenticated = true;
    this.gapi.client.request({
        path: '/youtube/v3/channels',
        params: {
            part: 'snippet',
            mine: true
        },
        callback: function (response) {
            if (response.error) {
                console.log(response.error.message);
            } else {
                $('#channel-name').text(response.items[0].snippet.title);
                $('#channel-thumbnail').attr('src', response.items[0].snippet.thumbnails.default.url);

                $('.pre-sign-in').hide();
                //$('.post-sign-in').show();
            }
        }.bind(this)
    });

    $('#upload').on("click", this.handleUploadClicked.bind(this));

};

function checkYt(){
    if ($('#disclaimerCheck').is(':checked')){
        return true;
    }
}

UploadVideo.prototype.uploadFile = function (file) {
    var metadata = {
        snippet: {
            title: $('#videoTitle').val(),
            description: $('#videoDescription').val(),
            tags: this.tags,
            categoryId: this.categoryId
        },
        status: {
            privacyStatus: $('#privacy-status option:selected').text()
        }
    };
    var uploader = new MediaUploader({
        baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
        file: file,
        token: this.accessToken,
        metadata: metadata,
        params: { 
            part: Object.keys(metadata).join(',')
        },
        onError: function (data) {
            var message = data;
            try {
                var errorResponse = JSON.parse(data);
                message = errorResponse.error.message;
            } finally {
                alert(message);
            }
        }.bind(this),
        onProgress: function (data) {
            var currentTime = Date.now();
            var bytesUploaded = data.loaded;
            var totalBytes = data.total;

            var bytesPerSecond = bytesUploaded / ((currentTime - this.uploadStartTime) / 1000);
            var estimatedSecondsRemaining = (totalBytes - bytesUploaded) / bytesPerSecond;
            var percentageComplete = (bytesUploaded * 100) / totalBytes;

            $('#upload-progress').attr({
                value: bytesUploaded,
                max: totalBytes
            });

            $('#percent-transferred').text(percentageComplete);
            $('#bytes-transferred').text(bytesUploaded);
            $('#total-bytes').text(totalBytes);

            $('.during-upload').show();
        }.bind(this),
        onComplete: function (data) {
            var uploadResponse = JSON.parse(data);
            this.videoId = uploadResponse.id;
            $('#video-id').text(this.videoId);
            $('.post-upload').show();
            this.pollForVideoStatus();
        }.bind(this)
    });

    this.uploadStartTime = Date.now();
    uploader.upload();
};

UploadVideo.prototype.handleUploadClicked = function () {
    if (checkYt()) {
        $('#upload').attr('enabled', true);
        //this.uploadFile($('#fileID').get(0).files[0]);
        this.uploadFile(window.parent.$("#iframe").contents().find('#fileID').get(0).files[0]);
    }
};


UploadVideo.prototype.pollForVideoStatus = function () {
    this.gapi.client.request({
        path: '/youtube/v3/videos',
        params: {
            part: 'status,player',
            id: this.videoId
        },
        callback: function (response) {
            if (response.error) {
                console.log(response.error.message);
                setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
            } else {
                var uploadStatus = response.items[0].status.uploadStatus;
                switch (uploadStatus) {
                    case 'uploaded':
                        $('#post-upload-status').append('<li>Upload status: ' + uploadStatus + '</li>');
                        setTimeout(this.pollForVideoStatus.bind(this), STATUS_POLLING_INTERVAL_MILLIS);
                        break;
                    case 'processed':
                        $('#player').append(response.items[0].player.embedHtml);
                        $('#post-upload-status').append('<li>Final status.</li>');
                        break;
                    default:
                        $('#post-upload-status').append('<li>Transcoding failed.</li>');
                        break;
                }
            }
        }.bind(this)
    });
};