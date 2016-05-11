var functions = {};
var graphObject = {};
var artistList = [];
var artistsViews = {};

functions.buildGraphObject = function(docs, callback){
    var totalViews = 0;
    docs.forEach(function(doc){
        totalViews  += doc.views
    });
    console.log("total views "+ totalViews);
    graphObject.number = totalViews;
    graphObject.name = "SoundCloud";
    graphObject.drilldown = [];
    buildArtistList(docs);
    getArtistViews(docs);
    buildTotalDrillDowns(docs);
    console.log("the object: " + JSON.stringify(graphObject));
    callback(graphObject);
}

function getArtist(item){
    if(item.artist.indexOf("UZI") !== -1){
        var artist = item.artist.split(":")[1].trim().split(" ")[0]
    }else{
    var artist = item.artist.split("-")[0].trim()
        }
    return artist;
}

function getSong(item){
    if(item.artist.indexOf("UZI") !== -1){
        var song = item.artist.split(":")[0].trim()
    }else{
        var song = item.artist.split("-")[1].trim()
    }
    return song;
}

function buildArtistList(docs){
    docs.forEach(function(doc){
        if(artistList.indexOf(getArtist(doc)) == -1) {
            artistList.push(getArtist(doc));
        }
    })
}

function getArtistViews(docs){
    artistList.forEach(function(artist){
        artistsViews[artist] = 0;
    })
    docs.forEach(function(doc){
            artistsViews[getArtist(doc)] += doc.views;
    })
}

function buildArtistTotalViewsDrilldown(docs, artistName){
        var drilldown = {};
        drilldown.number = artistsViews[artistName]
        drilldown.name = artistName
        drilldown.drilldown = buildSongTotalViewsDrilldown(docs, artistName);
        return drilldown;
}

function buildSongTotalViewsDrilldown(docs, artistName){
    var songDrilldowns = [];
    docs.forEach(function(doc){
        if(getArtist(doc) == artistName) {
            var drilldown = {};
            drilldown.number = doc.views;
            drilldown.name = getSong(doc);
            songDrilldowns.push(drilldown);
        }
    })
    return songDrilldowns;
}

function buildTotalDrillDowns(docs){
    artistList.forEach(function(artist){
       graphObject.drilldown.push(buildArtistTotalViewsDrilldown(docs,artist));
    });
}

module.exports = functions;
//
// var buildGraphItem = function(element){
//     var graphItem = {};
// }


// {
//
// //SOUNDCLOUD STATS
//     number: 10000,
//         name: "SoundCloud",
//     drilldown: [{
//     number: 6500,
//     name: "Metallica",
//     drilldown: [{
//         number: 3000,
//         name: "Master Of Puppets"
//     },
//         {
//             number: 3500,
//             name: "Ride the Lightning"
//         }]
// },
//     {
//         number: 3500,
//         name: "Parkway Drive",
//         drilldown: [{
//             number: 2000,
//             name: "Deep Blue",
//             drilldown: [{
//                 number: 1250,
//                 name: "Home is for the Heartless"
//             },
//                 {
//                     number: 750,
//                     name: "Deadweight"
//                 }]
//         }, {
//             number: 1500,
//             name: "Horizons",
//             drilldown: [{
//                 number: 700,
//                 name: "Boneyards"
//             },
//                 {
//                     number: 800,
//                     name: "Idols and Anchors"
//                 }]
//         }]
//     }]
// }
