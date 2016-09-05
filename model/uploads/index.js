functions = {};
functions.added = null;
functions.audio = "";

functions.addId = function(id){
    functions.added = id;
}

functions.setAudio = function(isAudio){
    functions.audio = isAudio;
}


functions.returnAdded = function(){
    if(functions.added != null){
        console.log("in returnAdded " + functions.added.toString() )
        return functions.added.toString();

    }else{
        console.log("in returnAdded " );
        return null;

    }

};

module.exports = functions;