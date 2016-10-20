google.charts.load('current', {'packages': ['geochart']});
google.charts.setOnLoadCallback(drawRegionsMap);


function drawRegionsMap() {
    console.log("m" + JSON.stringify(mapData[0][localStorage.videoIndex]));
    var data = google.visualization.arrayToDataTable(codesToNames(mapData[0][localStorage.videoIndex]));

    var options = {};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
}

