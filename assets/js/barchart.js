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

var svg2 = d3.select("#barchart-visualization2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg3 = d3.select("#barchart-visualization3").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Initialize data
loadData();

// College Data
var data;
var data2;
var data3;

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
var color2 = d3.scale.category20();
var color3 = d3.scale.category20();

// Load CSV file
function loadData() {
    d3.csv("data/data.csv", function(error, csv) {

        // Store csv data in global variable
        data = csv;
        data2 = csv;
        data3 = csv;

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

        data2.forEach(function(d){
            // Convert numeric values to 'numbers'
            d.INC_PCT_LO = +d.INC_PCT_LO;
            d.INC_PCT_M1 = +d.INC_PCT_M1;
            d.INC_PCT_M2 = +d.INC_PCT_M2;
            d.INC_PCT_H1 = +d.INC_PCT_H1;
            d.INC_PCT_H2 = +d.INC_PCT_H2;
        });

        data3.forEach(function(d){
            // Convert numeric values to 'numbers'
            d.PAR_ED_PCT_MS = +d.PAR_ED_PCT_MS;
            d.PAR_ED_PCT_HS = +d.PAR_ED_PCT_HS;
            d.PAR_ED_PCT_PS = +d.PAR_ED_PCT_PS;
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

        svg2.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width - 125)
            .attr("y", -5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("School Names");

        svg2.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90) translate(0, -50)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percent of Undergraduates By Family Income");

        svg3.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width - 125)
            .attr("y", -5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("School Names");

        svg3.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90) translate(0, -50)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percent of Undergraduates By Parents' Highest Education Level");

        //// Draw the visualization for the first time
        updateVisualization();
    });
}

// Render visualization
function updateVisualization() {

    if (d3.select("#var1").property("value") != d3.select("#var2").property("value")) {
        choice1 = d3.select("#var1").property("value");
        choice2 = d3.select("#var2").property("value");
    }

    x.domain([choice1, choice2]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    svg2.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    svg3.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    color.domain(d3.keys(data[0]).filter(function(key) {
        return key == "UGDS_WHITE" || key == "UGDS_BLACK" || key == "UGDS_HISP" || key == "UGDS_ASIAN" ||
            key == "UGDS_AIAN" || key == "UGDS_2MOR" || key == "UGDS_NRA" || key == "UGDS_UNKN";
    }));

    color2.domain(d3.keys(data2[0]).filter(function(key) {
        return key == "INC_PCT_LO" || key == "INC_PCT_M1" || key == "INC_PCT_M2" || key == "INC_PCT_H1" ||
            key == "INC_PCT_H2";
    }));

    color3.domain(d3.keys(data2[0]).filter(function(key) {
        return key == "PAR_ED_PCT_MS" || key == "PAR_ED_PCT_PS" || key == "PAR_ED_PCT_HS";
    }));

    data.forEach(function (d) {
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

    data2.forEach(function (d) {
        var y0 = 0;
        d.categories2 = color2.domain().map(function (name) {
            if (!isNaN(d[name])) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            }
            else {
                return {name: name, y0: y0, y1: y0};
            }
        });
    });

    data3.forEach(function (d) {
        var y0 = 0;
        d.categories3 = color3.domain().map(function (name) {
            if (!isNaN(d[name])) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            }
            else {
                return {name: name, y0: y0, y1: y0};
            }
        });
    });

    var clear1 = svg.append("rect")
        .attr("x", 1)
        .attr("y", 0)
        .attr("width", 350)
        .attr("height", 400)
        .attr("fill", "white");

    var clear2 = svg2.append("rect")
        .attr("x", 1)
        .attr("y", 0)
        .attr("width", 350)
        .attr("height", 400)
        .attr("fill", "white");

    var clear3 = svg3.append("rect")
        .attr("x", 1)
        .attr("y", 0)
        .attr("width", 350)
        .attr("height", 400)
        .attr("fill", "white");

    var missing = svg.append("text")
        .attr("x", 90)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing2 = svg.append("text")
        .attr("x", 250)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing3 = svg2.append("text")
        .attr("x", 90)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing4 = svg2.append("text")
        .attr("x", 250)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing5 = svg3.append("text")
        .attr("x", 90)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing6 = svg3.append("text")
        .attr("x", 250)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var school = svg.selectAll(".school")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .filter(function (d) {
            return (d.INSTNM == choice1 || d.INSTNM == choice2);
        })
        .attr("transform", function (d) {
            if (!isNaN(x(d.INSTNM))) {
                return "translate(" + x(d.INSTNM) + ",0)";
            }
        });

    school.selectAll("rect")
        .data(function (d) {
            return d.categories;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.y1);
        })
        .attr("height", function (d) {
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    var school2 = svg2.selectAll(".school")
        .data(data2)
        .enter().append("g")
        .attr("class", "g")
        .filter(function (d) {
            return (d.INSTNM == choice1 || d.INSTNM == choice2);
        })
        .attr("transform", function (d) {
            if (!isNaN(x(d.INSTNM))) {
                return "translate(" + x(d.INSTNM) + ",0)";
            }
        });

    school2.selectAll("rect")
        .data(function (d) {
            return d.categories2;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.y1);
        })
        .attr("height", function (d) {
            console.log(y(d.y0) - y(d.y1));
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function (d) {
            return color2(d.name);
        });

    var school3 = svg3.selectAll(".school")
        .data(data3)
        .enter().append("g")
        .attr("class", "g")
        .filter(function (d) {
            return (d.INSTNM == choice1 || d.INSTNM == choice2);
        })
        .attr("transform", function (d) {
            if (!isNaN(x(d.INSTNM))) {
                return "translate(" + x(d.INSTNM) + ",0)";
            }
        });

    school3.selectAll("rect")
        .data(function (d) {
            return d.categories3;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
            return y(d.y1);
        })
        .attr("height", function (d) {
            console.log(y(d.y0) - y(d.y1));
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function (d) {
            return color3(d.name);
        });

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
            else if (d == "UGDS_BLACK") { return "Black"; }
            else if (d == "UGDS_HISP") { return "Hispanic"; }
            else if (d == "UGDS_ASIAN") { return "Asian"; }
            else if (d == "UGDS_AIAN") { return "American Indian/Alaska Native"; }
            else if (d == "UGDS_2MOR") { return "Two or more races"; }
            else if (d == "UGDS_NRA") { return "Non-resident aliens"; }
            else if (d == "UGDS_UNKN") { return "Race unknown"; }
        });

    var legend2 = svg2.selectAll(".legend")
        .data(color2.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend2.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color2);

    legend2.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "INC_PCT_LO") { return "$0-$30,000"; }
            else if (d == "INC_PCT_M1") { return "$30,001-$48,000"; }
            else if (d == "INC_PCT_M2") { return "$48,001-$75,000"; }
            else if (d == "INC_PCT_H1") { return "$75,001-$110,000"; }
            else if (d == "INC_PCT_H2") { return "$110,001+"; }
        });

    var legend3 = svg3.selectAll(".legend")
        .data(color3.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend3.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color3);

    legend3.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            if (d == "PAR_ED_PCT_MS") { return "Middle School"; }
            else if (d == "PAR_ED_PCT_HS") { return "High School"; }
            else if (d == "PAR_ED_PCT_PS") { return "Post-Secondary Education"; }
        });

}