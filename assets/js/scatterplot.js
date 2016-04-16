/**
 * Created by erikgodard on 4/13/16.
 */

// one axis that's a measure of success
// one axis that is a factor that can affect that
// like average SAT score v. 4 year graduation rate


// SVG drawing area

var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#school-visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initializes Variables
var data,DATA,start,end, name;
var choice1 = "SAT_AVG_ALL";
var choice2 = "C150_4";

// create x scale
var x = d3.scale.linear()
    .range([0, width]);

// create y scale
var y = d3.scale.linear()
    .range([height, 0]);

//var getChoice = function (d) { return d[choice]; };

// x axis function
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// y axis function
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// add x axis
var xDraw = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")");

// add y axis
var yDraw = svg.append("g")
    .attr("class", "axis y-axis");

//// line chart
//var line = d3.svg.line()
//    .x(function (d) { if(!isNaN(d[choice1]) && !isNaN(d[choice2])) {return x(d[choice1]);} })
//    .y(function (d) { if(!isNaN(d[choice1]) && !isNaN(d[choice2])) {return y(d[choice2]);} })
//    .interpolate("linear");
//
//// append path
//var path = svg.append('g').append("path").attr("class",'line');

// make the tooltip
//var tip = d3.tip()
//    .attr('class', 'd3-tip')
//    .offset([-10, 1]);

var table = d3.select("#table");
table.style("display", "none");

// Initialize data
loadData();
// Load CSV file
function loadData() {
    d3.csv("data/data.csv", function (error, csv) {
        csv.forEach(function(d) {
            // Convert numeric values to 'numbers'
            d.TUITFTE = +d.TUITFTE;
            d.INEXPFTE = +d.INEXPFTE;
            d.ADM_RATE_ALL = +d.ADM_RATE_ALL;
            d.SAT_AVG_ALL = +d.SAT_AVG_ALL;
            d.UGDS = +d.UGDS;
            d.UGDS_WHITE = +d.UGDS_WHITE;
            d.UGDS_BLACK = +d.UGDS_BLACK;
            d.UGDS_HISP = +d.UGDS_HISP;
            d.UGDS_ASIAN = +d.UGDS_ASIAN;
            d.UGDS_AIAN = +d.UGDS_AIAN;
            d.UGDS_2MOR = +d.UGDS_2MOR;
            d.UGDS_NRA = +d.UGDS_NRA;
            d.UGDS_UNKN = +d.UGDS_UNKN;
            d.INC_PCT_LO = +d.INC_PCT_LO;
            d.INC_PCT_M1 = +d.INC_PCT_M1;
            d.INC_PCT_M2 = +d.INC_PCT_M2;
            d.INC_PCT_H1 = +d.INC_PCT_H1;
            d.INC_PCT_H2 = +d.INC_PCT_H2;
            d.RET_FT4 = +d.RET_FT4;
            d.PAR_ED_PCT_1STGEN = +d.PAR_ED_PCT_1STGEN;
            d.PCTFLOAN = +d.PCTFLOAN;
            d.PCTPELL = +d.PCTPELL;
            d.GRAD_DEBT_MDN_SUPP = +d.GRAD_DEBT_MDN_SUPP;
            d.C150_4 = +d.C150_4;
            d.C200_4 = +d.C200_4;
            d.CONTROL = +d.CONTROL;
        });
        // Store csv data in global variable
        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });}


// Render visualization
function updateVisualization() {
    // create choice
    //choice = d3.select("#ranking-type").property("value");
    //start = d3.select("#start").property("value");
    //end = d3.select("#end").property("value");

    // redefine x and y domain
    x.domain([0, d3.max(data, function (d) {
        return d[choice1];
    })]);
    y.domain([0, d3.max(data, function (d) {
        return d[choice2];
    })]);

    //// call the tooltip
    //tip.html(function(d) {
    //        //return "<strong>" + d.INSTNM + " versus " + choice2 + "<br></strong> <span style='color:red'>" + d.GOALS +
    //        //    "</span><strong><br>"+ "EDITION" + "</strong><span style='color:red'>" +"<br>"+ d.EDITION + "</span>";
    //        return "<strong>" + d.INSTNM + "<br></strong>";
    //    });
    //svg.call(tip);

    var circle = svg.selectAll("circle")
        .data(data);

    circle.enter()
        .append("circle");

    circle.transition()
        .duration(800)
        .attr("cx", function (d) { if(!isNaN(d[choice1]) && !isNaN(d[choice2])) {return x(d[choice1]);} })
        .attr("cy", function (d) { if(!isNaN(d[choice1]) && !isNaN(d[choice2])) {return y(d[choice2]);} })
        .attr("fill", function(d){
            if(d.CONTROL == 1)
            {return "pink";}
            else
            {return "orange";}
        })
        .attr("r", 4);


    //circle.on('mouseover', tip.show)
    //    .on('mouseout', tip.hide);
        //.on("click", showEdition);


    circle.exit()
        .transition()
        .duration(800)
        .remove();


    //// append path
    //path.transition()
    //    .duration(800)
    //    .attr("d", line(data));

    xDraw.transition()
        .duration(800)
        .call(xAxis);

    yDraw.transition()
        .duration(800)
        .call(yAxis);

}

//
//// Show details for a specific FIFA World Cup
//function showEdition(d){
//    table.style("display",null);
//    d3.select("#EDITION").text(d.EDITION);
//    d3.select("#WINNER").text(d.WINNER);
//    d3.select("#GOALS").text(d.GOALS);
//    d3.select("#AVGOALS").text(d.AVERAGE_GOALS);
//    d3.select("#MATCHES").text(d.MATCHES);
//    d3.select("#TEAMS").text(d.TEAMS);
//    d3.select("#AVATTENDANCE").text(d.AVERAGE_ATTENDANCE);
//
//}