var User = require('../../models/User');
var sc = require('../../control/passport/reauthentication/soundcloud');
var yt = require('../../control/passport/reauthentication/youtube');

module.exports = function(service){
    var sId = '';
    sId += service;
    sId+= '.id';
    if(service == "soundcloud") {
        User.findOne({'soundcloud.id': "218749953"}, function (err, data) {
            if (err) {
                throw err;
            }
            else{
                console.log('in scheduled soundcloud check');
                if (testExpirationNearing(data.soundcloud.expires_in)) {
                    sc(data.soundcloud.refresh_token);
                }
            }
        })
    }else if(service == "youtube"){

        User.findOne({'youtube.id': 'UCmR4dyc4xxJTqcyu2PWSNyQ'} , function(err, data){
            if (err) {
                throw err;
            }else{
                console.log('in scheduled youtube check');
                if (testExpirationNearing(data.youtube.expires_in)) {
                    yt(data.youtube.refresh_token);
                }
            }
        });
    }
}

function testExpirationNearing(exp){
    if((exp - 300000) < new Date().getTime()){
        return true;
    }
}

