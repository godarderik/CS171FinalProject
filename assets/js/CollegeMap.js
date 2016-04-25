/**
 * Created by erikgodard on 4/15/16.
 */


var markers = [];
CollegeMap = function(_parentElement, _data, _mapPosition) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = _mapPosition;
    this.shouldDraw = true;

}

var geoJSON;
//Taken from https://gist.github.com/mshafrir/2646763
var states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

/*
 *  Initialize station map
 */

CollegeMap.prototype.initVis = function() {
    var vis = this;
    var out;

    L.Icon.Default.imagePath = 'images';
    console.log(this.mapPosition);
    this.collegeMap = L.map(this.parentElement,
        {
            minZoom : 4
        }).setView(this.mapPosition, 4);
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

    var statesCounts = this.data.map(function(a)
    {
        return a["STABBR"];
    });
    var out = _.countBy(statesCounts);
    var outHash = {};

    for (var i in out)
    {
        outHash[states[i]] = out[i];
    }
    function style(feature) {
        return {
            fillColor: getColor(outHash[feature.properties.name]),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    if (geoJSON !== undefined)
    {
        geoJSON.clearLayers();
    }
    geoJSON = L.geoJson(statesData, {style: style});
    geoJSON.addTo(this.collegeMap);
    markers = [];
    if (this.shouldDraw)
    {
        this.data.forEach(function(item){
            var marker = L.marker([item.LATITUDE, item.LONGITUDE]);
            marker.bindPopup(item.INSTNM + "<br><a href=school.html?s=" + item.UNITID + ">More Information</a>" ).openPopup();
            vis.collegeMap.addLayer(marker);
            markers.push(marker);
        });
    };

}

function getColor(d) {
    return d > 300 ? '#800026' :
        d > 100  ? '#BD0026' :
            d > 50  ? '#E31A1C' :
                d > 20  ? '#FC4E2A' :
                    d > 10   ? '#FD8D3C' :
                        d > 5   ? '#FEB24C' :
                            d > 1   ? '#FED976' :
                                '#FFEDA0';
}

