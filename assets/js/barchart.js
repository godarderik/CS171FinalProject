/**
 * Created by erikgodard on 4/13/16.
 */

// SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("barchart-visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialize data
loadData();

// College Data
var data;

// Create scales and axes
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

// Load CSV file
function loadData() {
    d3.csv("data/fifa-world-cup.csv", function(error, csv) {

        csv.forEach(function(d){
            // Convert string to 'date object'
            d.YEAR = formatDate.parse(d.YEAR);

            // Convert numeric values to 'numbers'
            d.TEAMS = +d.TEAMS;
            d.MATCHES = +d.MATCHES;
            d.GOALS = +d.GOALS;
            d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
            d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
        });

        // Store csv data in global variable
        data = csv;

        x.domain(d3.extent(data, function(d) {
            return d.YEAR;
        }));

        // Append axes
        svg.append("g")
            .attr("class", "axis x-axis")
            .call(xAxis)
            .attr("transform", "translate(0, 400)");

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);

        // Draw the visualization for the first time
        updateVisualization();
    });
}


// Render visualization
function updateVisualization() {

    console.log(data);

    var start = d3.select("#start").property("value");
    var end = d3.select("#end").property("value");

    start = formatDate.parse(start);
    end = formatDate.parse(end);

    // Get value from select menu
    var selectedValue = d3.select("#ranking-type").property("value");

    // Update scales

    x.domain([start, end]);

    y.domain(d3.extent(data, function(d) {
        return d[selectedValue];
    }));

    var line = d3.svg.line()
        .x(function(d) {
            return x(d.YEAR);
        })
        .y(function(d) {
            return y(d[selectedValue]);
        })
        .interpolate("linear");


    var lineSvg = svg.selectAll("path")
        .data(data.filter(function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return d;
            }
        }));

    lineSvg
        .enter()
        .append("svg:path")
        .attr("class", "line")
        .attr("fill", "#b8f2df")
        .attr("d", line(data.filter(function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return d;
            }
        })));

    lineSvg
        .transition()
        .duration(800)
        .attr("d", line(data.filter(function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return d;
            }
        })));

    lineSvg
        .exit()
        .remove();

    // Update circles
    var circles = svg.selectAll("circle")
        .data(data);

    // Enter (initialize the newly added elements)
    circles.enter().append("circle")
        .attr("class", function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return "points";
            }
            else {
                return null;
            }
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", function(d) {
            showEdition(d);
        });

    // Update (set the dynamic properties of the elements)
    circles
        .transition()
        .duration(800)
        .attr("cx", function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return x(d.YEAR);
            }
            else {
                return null;
            }
        })
        .attr("cy", function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return y(d[selectedValue]);
            }
            else {
                return null;
            }
        })
        .attr("r", function(d) {
            if((d.YEAR >= start) && (d.YEAR <= end)) {
                return 5;
            }
            else {
                return null;
            }
        });

    // Exit
    circles
        .exit()
        .remove();

    tip.html(function(d) {
        return ("<span>" + d.EDITION + "<br>" + selectedValue + ": " + d[selectedValue] + "</span>");
    });

    // Update axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    svg.selectAll("g.y-axis")
        .transition()
        .duration(800)
        .call(yAxis);
}


// Show details for a specific FIFA World Cup
function showEdition(d){
    d3.select("#table-title").text(d.EDITION);
    d3.select("#table-winner").text(d.WINNER);
    d3.select("#table-goals").text(d.GOALS);
    d3.select("#table-avg-goals").text(d.AVERAGE_GOALS);
    d3.select("#table-matches").text(d.MATCHES);
    d3.select("#table-teams").text(d.TEAMS);
    d3.select("#table-avg-attendance").text(d.AVERAGE_ATTENDANCE);
}