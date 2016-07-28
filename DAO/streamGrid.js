
module.exports = function StreamGridFile(req, res, GridFile) {
    if (req.headers['range']) {
        // Range request, partialle stream the file
        console.log('Range Reuqest');
        var parts = req.headers['range'].replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];
        var start = parseInt(partialstart, 10);

        var end = partialend ? parseInt(partialend, 10) : GridFile.length - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Content-disposition': 'filename=xyz',
            'Accept-Ranges': 'bytes',
            'Content-Type': GridFile.contentType,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
            'Content-Length': chunksize
        }); 

        // Set filepointer
        GridFile.seek(start, function () {
            // get GridFile stream
            var stream = GridFile.stream(true);

            // write to response
            stream.on('data', function (buff) {
                // count data to abort streaming if range-end is reached
                // perhaps theres a better way?
                if (start >= end) {
                    // enough data send, abort
                    GridFile.close();
                    res.end();
                } else {
                    res.write(buff);
                }
            });
        });

    } else {

        // stream back whole file
        console.log('No Range Request');
        res.header('Content-Type', GridFile.contentType);
        res.header('Content-Length', GridFile.length);
        var stream = GridFile.stream(true);
        stream.pipe(res);
    }
}
