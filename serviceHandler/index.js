var SC = require('../control/soundcloud');
var YT = require('../control/youtube/getStats');
var DAO = require('../DAO');
var functions = {};

functions.getTrackDataFromSoundcloud = function(){
    SC.authorizeSC();
    SC.getTracks(function (tracks) {
        SC.getTrackData(tracks);
    });
}

functions.getViewDataFromYoutube = function(){
    var countie = 0;
    YT.getVideoIDs(function(vids, titleList){
})

}
module.exports = functions;


