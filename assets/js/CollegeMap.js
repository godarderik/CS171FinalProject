/**
 * Created by erikgodard on 4/15/16.
 */

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


    L.Icon.Default.imagePath = 'img';
    console.log(this.mapPosition);
    this.bikeMap = L.map(this.parentElement).setView(this.mapPosition, 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.bikeMap);

    vis.wrangleData();

    $.getJSON("data/MBTA-Lines.json", function(data) {
        L.geoJson(data).addTo(vis.bikeMap);

    });
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
    this.data.forEach(function(item){
        L.marker([item.lat, item.long]).addTo(vis.bikeMap);
    });
}

