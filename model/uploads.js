var uploads = [];

functions = {};

functions.addUpload = function(id){
    uploads.push(id);
}
functions.getUpload = function(index){
    return uploads[index];
}
functions.getUploadsLength = function(){
    return uploads.length;
}
functions.getModel = function(){
    return uploads;
};

module.exports = functions;