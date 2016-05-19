
//var uploads = require('../model/uploads');
var Grid = require('gridfs-stream'); // 1.1.1"
var data = require('./mongoConnect');
var mongoose = require('mongoose');
Grid.mongo = mongoose.mongo;
var db = require('./mongoConnect.js');
var mongo = require('mongodb'); // 2.0.31
var StreamGridFile = require('./streamGrid');
var gfsSingle = require('../model/gfs');
var gfs;
var uploads = require('../model/uploads');
var blobstream = require('blob-stream');
var fs = require('fs');
//var model = require('../model/uploads');




functions = {};


var myMime;

functions.router = function(router) {

    db.open(function (err, data) {
        if (err) throw err;
        console.log("data " + data);
        gfs = Grid(data);
        gfsSingle.setGfs(gfs);
        console.log("set gfs");
    });
    
    var Busboy = require('busboy'); // 0.2.9
    var GridStore = mongo.GridStore;
    var ObjectID = require('mongodb').ObjectID;
    
    router.get('/up/files/get/:file', function (req, res) {
        new GridStore(db, new ObjectID(req.params.file), null, 'r').open(function (err, GridFile) {
            if (!GridFile) {
                res.send(404, 'Not Found');
                return;
            }
            StreamGridFile(req, res, GridFile);
        });
    });

    router.post('/up/file', function (req, res) {
        var busboy = new Busboy({headers: req.headers});
       // console.log(JSON.stringify(req));
        var fileId = new mongo.ObjectId();
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log('got file', filename, mimetype, encoding);
            var writeStream = gfs.createWriteStream({
                _id: fileId,
                filename: filename,
                mode: 'w',
                content_type: mimetype
            });
            myMime = mimetype;
            //uploads.addUpload(fileId);

            file.pipe(writeStream);
        }).on('finish', function () {
            if(myMime.toString().indexOf("audio") != -1){
                console.log("Audio");
                uploads.audio = true;
                uploads.added = fileId;
            }else{
                console.log("not Audio");

                uploads.audio = false;
                uploads.added = fileId;
            }
            // show a link to the uploaded file

            // res.writeHead(200, {'content-type': 'text/html'});
            // res.end('<link href="/stylesheets/bootstrap.min.css"  type="text/css" rel="stylesheet">'+
            //     '<form style="background-color: powderblue" action="/up/file" class="form" enctype="multipart/form-data" method="post">' +
            //     '<input type="file"  class="form-control" name="file" required>' +
            //     '<input type="submit" class="form-control" value="Upload">' +
            //     '</form>');
            res.render('partials/up')
        });
        req.pipe(busboy);
    });

    router.get('/up/', function (req, res) {
        // show a file upload form
       // res.writeHead(200, {'content-type': 'text/html'});
        res.render('partials/up')
    //     res.end(
    //         '<link href="/stylesheets/bootstrap.min.css"  type="text/css" rel="stylesheet">'+
    //         '<form style="background-color: powderblue" action="/up/file" class="form" enctype="multipart/form-data" method="post">' +
    //         '<input type="file"  class="form-control" name="file" required>' +
    //         '<input type="submit" class="form-control" value="Upload">' +
    //         '</form>'
    //     );
    });

    router.get('/up/file/:id', function (req, res) {
        gfs.findOne({_id: req.params.id}, function (err, file) {
            if (err) return res.status(400).send(err);
            if (!file) return res.status(404).send('');

            res.set('Content-Type', file.contentType);
            res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

            var readstream = gfs.createReadStream({
                _id: file._id
            });

            readstream.on("error", function (err) {
                console.log("Got error while processing stream " + err.message);
                res.end();
            });
            readstream.pipe(res);
        });
    });
};

var body = [];
functions.getFile = function(fileId, callback){
    gfs.findOne({_id: fileId}, function (err, file) {
        var readstream = gfs.createReadStream({
            _id: file._id
        });

        readstream.on("error", function (err) {
            console.log("Got error while processing stream " + err.message);
        
        });
        readstream.on('data', function(chunk){

            body.push(chunk);
        });

        readstream.on('end', function(){
            var cunt = new Int8Array(body);
            // var i = 0;
            // cunt.map(
            //     function(){
            //         i++;
            //         return body[i];
            //     });
            console.log("oday "+ cunt.toString());
            callback(new Int8Array(body), file.filename);
            });
        
    });
}




module.exports = functions;