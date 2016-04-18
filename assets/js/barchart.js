/**
 * Created by erikgodard on 4/13/16.
 */

// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#barchart-visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialize data
loadData();

// College Data
var data;

var choice1 = "Harvard University";
var choice2 = "Yale University";

// Create scales and axes
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width - 200], .5);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.category20();

// Load CSV file
function loadData() {
    d3.csv("data/data.csv", function(error, csv) {

        // Store csv data in global variable
        data = csv;

        console.log(data);

        data.forEach(function(d){
            // Convert numeric values to 'numbers'
            d.UGDS = +d.UGDS;
            d.UGDS_WHITE = +d.UGDS_WHITE;
            d.UGDS_BLACK = +d.UGDS_BLACK;
            d.UGDS_HISP = +d.UGDS_HISP;
            d.UGDS_ASIAN = +d.UGDS_ASIAN;
            d.UGDS_AIAN = +d.UGDS_AIAN;
            d.UGDS_2MOR = +d.UGDS_2MOR;
            d.UGDS_NRA = +d.UGDS_NRA;
            d.UGDS_UNKN = +d.UGDS_UNKN;
        });

        x.domain([choice1, choice2]);
        y.domain([0,1]);

        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width - 125)
            .attr("y", -5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("School Names");

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90) translate(0, -50)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percent of Undergraduates By Race");

        //// Draw the visualization for the first time
        updateVisualization();
    });
}


// Render visualization
function updateVisualization() {

    choice1 = d3.select("#var1").property("value");
    choice2 = d3.select("#var2").property("value");

    x.domain([choice1, choice2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key == "UGDS_WHITE" || key == "UGDS_BLACK" || key == "UGDS_HISP" || key == "UGDS_ASIAN" ||
            key == "UGDS_AIAN" || key == "UGDS_2MOR" || key == "UGDS_NRA" || key == "UGDS_UNKN";
    }));

    data.forEach(function(d) {
        var y0 = 0;
        d.categories = color.domain().map(function (name) {
            if (!isNaN(d[name])) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            }
            else {
                return {name: name, y0: y0, y1: y0};
            }
        });
    });

    //data.sort(function(a, b) { return b.total - a.total; });

    //y.domain([0, d3.max(data, function(d) {
    //    return d.total;
    //})]);

    var school = svg.selectAll(".school")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .filter(function(d) {
            return (d.INSTNM == choice1 || d.INSTNM == choice2)
        })
        .attr("transform", function(d) {
            if(!isNaN(x(d.INSTNM))) {
                return "translate(" + x(d.INSTNM) + ",0)";
            }
        });

    school.selectAll("rect")
        .data(function(d) {
            return d.categories;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.y1);
        })
        .attr("height", function(d) {
            console.log(y(d.y0) - y(d.y1));
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "UGDS_WHITE") { return "White"; }
            if (d == "UGDS_BLACK") { return "Black"; }
            if (d == "UGDS_HISP") { return "Hispanic"; }
            if (d == "UGDS_ASIAN") { return "Asian"; }
            if (d == "UGDS_AIAN") { return "American Indian/Alaska Native"; }
            if (d == "UGDS_2MOR") { return "Two or more races"; }
            if (d == "UGDS_NRA") { return "Non-resident aliens"; }
            if (d == "UGDS_UNKN") { return "Race unknown"; }
        });
}


//// Show details for a specific FIFA World Cup
//function showEdition(d){
//    d3.select("#table-title").text(d.EDITION);
//    d3.select("#table-winner").text(d.WINNER);
//    d3.select("#table-goals").text(d.GOALS);
//    d3.select("#table-avg-goals").text(d.AVERAGE_GOALS);
//    d3.select("#table-matches").text(d.MATCHES);
//    d3.select("#table-teams").text(d.TEAMS);
//    d3.select("#table-avg-attendance").text(d.AVERAGE_ATTENDANCE);
//}