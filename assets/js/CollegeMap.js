/**
 * Created by erikgodard on 4/15/16.
 */


var markers = [];
CollegeMap = function(_parentElement, _data, _mapPosition) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = _mapPosition;

}


/*
 *  Initialize station map
 */

CollegeMap.prototype.initVis = function() {
    var vis = this;


    L.Icon.Default.imagePath = 'images';
    console.log(this.mapPosition);
    this.collegeMap = L.map(this.parentElement).setView(this.mapPosition, 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.collegeMap);

    vis.wrangleData();
   // $.getJSON("data/MBTA-Lines.json", function(data) {
    //    L.geoJson(data).addTo(vis.bikeMap);

    //});
}


/*
 *  Data wrangling
 */

CollegeMap.prototype.wrangleData = function() {
    var vis = this;

    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();
}


/*
 *  The drawing function
 */

CollegeMap.prototype.updateVis = function() {
    var vis = this;
    console.log(this.data.length);

    for (var i = 0; i < markers.length; ++i)
    {
        vis.collegeMap.removeLayer(markers[i]);
    }

    markers = [];

    this.data.forEach(function(item){
        var marker = L.marker([item.LATITUDE, item.LONGITUDE]);
        vis.collegeMap.addLayer(marker);
        markers.push(marker);
    });
}

