/**
 * Created by erikgodard on 4/15/16.
 */

var allData = [];

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {

    // Hubway XML station feed
    var url = 'http://www.thehubway.com/data/stations/bikeStations.xml';

    // TO-DO: LOAD DATA
    // Build YQL query (request whole JSON feed from the given url)
    var yql = 'http://query.yahooapis.com/v1/public/yql?q='
        + encodeURIComponent('SELECT * FROM xml WHERE url="' + url + '"')
        + '&format=json&callback=?';
    // Send an asynchronous HTTP request with jQuery
    $.getJSON(yql, function(jsonData){

        allData = jsonData.query.results.stations.station;
        console.log(allData);

        $("#station-count").html(allData.length);

        createVis();
    });



}


function createVis() {

    // TO-DO: INSTANTIATE VISUALIZATION

    stationMap = new CollegeMap("station-map", allData, [42.360082, -71.058880]);
    stationMap.initVis();

}