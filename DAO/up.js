

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
var fs = require('fs');





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
    
    var Busboy = require('busboy'); 
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
          
            res.render('partials/up')
        });
        req.pipe(busboy);
    });

    router.get('/up', function (req, res) {
        res.render('partials/up')
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


functions.getFile = function(fileId, callback){
    var body = new Int8Array();
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
            console.log("oday "+ cunt.toString());
            callback(body, file.filename, file.filetype);
        });
    });
}




module.exports = functions;