
var uploads = require('../model/uploads');
var Grid = require('gridfs-stream'); // 1.1.1"
var data = require('./mongoConnect');
var mongoose = require('mongoose');
Grid.mongo = mongoose.mongo;
var db = require('./mongoConnect.js');
var mongo = require('mongodb'); // 2.0.31
var StreamGridFile = require('./streamGrid');
var gfs;
var model = require('../model/uploads');

db.open(function (err, data) {
    if (err) throw err;
    console.log("data " + data);
    gfs = Grid(data);
});

module.exports = function(router) {
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
        var fileId = new mongo.ObjectId();
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            console.log('got file', filename, mimetype, encoding);
            var writeStream = gfs.createWriteStream({
                _id: fileId,
                filename: filename,
                mode: 'w',
                content_type: mimetype
            });
            uploads.addUpload(fileId);
            file.pipe(writeStream);
        }).on('finish', function () {
            // show a link to the uploaded file
            res.writeHead(200, {'content-type': 'text/html'});
            res.end('<link href="/stylesheets/bootstrap.min.css"  type="text/css" rel="stylesheet">'+
                '<form style="background-color: powderblue" action="/up/file" class="form" enctype="multipart/form-data" method="post">' +
                '<input type="file"  class="form-control" name="file" required>' +
                '<input type="submit" class="form-control" value="Upload">' +
                '</form>');

        });
        req.pipe(busboy);
    });

    router.get('/up/', function (req, res) {
        // show a file upload form
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<link href="/stylesheets/bootstrap.min.css"  type="text/css" rel="stylesheet">'+
            '<form style="background-color: powderblue" action="/up/file" class="form" enctype="multipart/form-data" method="post">' +
            '<input type="file"  class="form-control" name="file" required>' +
            '<input type="submit" class="form-control" value="Upload">' +
            '</form>'
        );
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