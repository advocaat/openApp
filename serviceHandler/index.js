var SC = require('../control/soundcloud');

var functions = {};


functions.getTrackDataFromSoundcloud = function(){
    SC.authorizeSC();
    SC.getTracks(function (tracks) {
        SC.getTrackData(tracks);
    });
}

module.exports = functions;


