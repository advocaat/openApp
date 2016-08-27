functions = {};
functions.added = null;
functions.audio = "";

functions.addId = function(id){
    functions.added = id;
}

functions.setAudio = function(isAudio){
    functions.audio = isAudio;
}


module.exports = functions;