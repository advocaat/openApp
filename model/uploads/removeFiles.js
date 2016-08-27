var files = [];

var functions = {};

functions.addFile = function(file){
    files.push(file);
}

functions.removeFile = function(){
    files.pop();
}

functions.testFile = function(){
    return files[0];
}

module.exports = functions;