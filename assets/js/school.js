/**
 * Created by erikgodard on 4/13/16.
 */

var width = 1200,
    height = 450,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function(d) { return d})
    .sort(null);

var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

var svgDem = d3.select("#school1-visualization").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "vis")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var parDem = d3.select("#school2-visualization").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "vis")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var incDem = d3.select("#school3-visualization").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "vis")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svgDem.append("g")
    .attr("class", "slices");
svgDem.append("g")
    .attr("class", "labels");
svgDem.append("g")
    .attr("class", "lines");

parDem.append("g")
    .attr("class", "slices");
parDem.append("g")
    .attr("class", "labels");
parDem.append("g")
    .attr("class", "lines");

incDem.append("g")
    .attr("class", "slices");
incDem.append("g")
    .attr("class", "labels");
incDem.append("g")
    .attr("class", "lines");

allData = {};
demoData = {};
incData = {};
parData = {};


loadData();



//Taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadData() {
    // Load CSV file
    d3.csv("data/data.csv", function(data) {
        data = data.filter(function(d,i) {
            // Convert numeric values to 'numbers'
            d.TUITFTE = +d.TUITFTE;
            d.LATITUDE = +d.LATITUDE;
            d.LONGITUDE = +d.LONGITUDE;
            d.INEXPFTE = +d.INEXPFTE;
            d.ADM_RATE_ALL = parseFloat(d.ADM_RATE_ALL);
            d.SAT_AVG_ALL = parseFloat(d.SAT_AVG_ALL);
            d.UGDS = +d.UGDS;
            d.UGDS_WHITE = +d.UGDS_WHITE;
            d.UGDS_BLACK = +d.UGDS_BLACK;
            d.UGDS_HISP = +d.UGDS_HISP;
            d.UGDS_ASIAN = +d.UGDS_ASIAN;
            d.UGDS_AIAN = +d.UGDS_AIAN;
            d.UGDS_2MOR = +d.UGDS_2MOR;
            d.UGDS_NRA = +d.UGDS_NRA;
            d.UGDS_NHPI = +d.UGDS_NHPI;
            d.UGDS_UNKN = +d.UGDS_UNKN;
            d.INC_PCT_LO = +d.INC_PCT_LO;
            d.INC_PCT_M1 = +d.INC_PCT_M1;
            d.INC_PCT_M2 = +d.INC_PCT_M2;
            d.INC_PCT_H1 = +d.INC_PCT_H1;
            d.INC_PCT_H2 = +d.INC_PCT_H2;
            d.RET_FT4 = +d.RET_FT4;
            d.PAR_ED_PCT_1STGEN = +d.PAR_ED_PCT_1STGEN;
            d.PAR_ED_PCT_HS = +d.PAR_ED_PCT_HS;
            d.PAR_ED_PCT_MS = +d.PAR_ED_PCT_MS;
            d.PAR_ED_PCT_PS  = +d.PAR_ED_PCT_PS;
            d.PCTFLOAN = +d.PCTFLOAN;
            d.PCTPELL = +d.PCTPELL;
            d.GRAD_DEBT_MDN_SUPP = +d.GRAD_DEBT_MDN_SUPP;
            d.C150_4 = +d.C150_4;
            d.C150_4_2MOR = +d.C150_4_2MOR;
            d.C150_4_AIAN = +d.C150_4_AIAN;
            d.C150_4_ASIAN = +d.C150_4_ASIAN;
            d.C150_4_BLACK = +d.C150_4_BLACK;
            d.C150_4_HISP = +d.C150_4_HISP;
            d.C150_4_NHPI = +d.C150_4_NHPI;
            d.C150_4_NRA = +d.C150_4_NRA;
            d.C150_4_UNKN = +d.C150_4_UNKN;
            d.C150_4_WHITE = +d.C150_4_WHITE;
            d.C200_4 = +d.C200_4;
            d.CONTROL = +d.CONTROL;

            allData[d.UNITID] = d;
            demoData[d.UNITID] = [ d.UGDS_WHITE,d.UGDS_BLACK, d.UGDS_HISP, d.UGDS_ASIAN, d.UGDS_AIAN, d.UGDS_2MOR, d.UGDS_UNKN];
            incData[d.UNITID] =  [d.INC_PCT_LO, d.INC_PCT_M1, d.INC_PCT_M2, d.INC_PCT_H1, d.INC_PCT_H2 ];
            parData[d.UNITID] = [d.PAR_ED_PCT_MS, d.PAR_ED_PCT_HS ,d.PAR_ED_PCT_PS];

            if (!isNaN(d.LONGITUDE) && !isNaN(d.LATITUDE))
            {
                return d;
            }



        });
        // Store csv data in global variable
        createVis();
    });



}
var demArr = ["White", "Black", "Hispanic", "Asian","American Indian", "Two or more", "Unknown"];
var parArr = ["Middle School", "High School","Post Secondary" ];
var incArr = ["$0-$30,000", "$30,001-$48,000", "$48,001-$75,000", "$75,001-$110,000", "$110,001+"];

var demKey = function(d,k){ return demArr[k]; };
var parKey = function(d,k){ return parArr[k]; };
var incKey = function(d,k){ return incArr[k]; };

function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
}
function createVis()
{
    var school = allData[getParameterByName("s")];
    var demo = demoData[getParameterByName("s")];
    var par = parData[getParameterByName("s")];
    var inc = incData[getParameterByName("s")];


    $("#school-name-header").html(school.INSTNM);

    $('#data-table').append('<tr><td>School Type</td><td>' + (school.CONTROL == 0 ? "Public" : "Private") + '</td></tr>');
    $('#data-table').append('<tr><td>Total Undergraduates</td><td>' + school.UGDS + '</td></tr>');
    $('#data-table').append('<tr><td>Tuition</td><td>' + accounting.formatMoney(school.TUITFTE) + '</td></tr>');
    $('#data-table').append('<tr><td>Average SAT Score</td><td>' + school.SAT_AVG_ALL + '</td></tr>');
    $('#data-table').append('<tr><td>Six Year Graduation Rate</td><td>' + Math.round(10000 * school.C150_4)/100 + '%</td></tr>');
    $('#data-table').append('<tr><td>Eight Year Graduation Rate</td><td>' +Math.round(10000 *  school.C200_4)/100 + '%</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Student Receiving Pell Grants</td><td>' + Math.round(10000* school.PCTPELL)/100 + '%</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Student Receiving Federal Loans</td><td>' + Math.round(10000 * school.PCTFLOAN)/100 + '%</td></tr>');
    $('#data-table').append('<tr><td>Median Debt of Graduates</td><td>' + accounting.formatMoney(school.GRAD_DEBT_MDN_SUPP) + '</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Students Returning After First Year</td><td>' + Math.round(10000 * school.RET_FT4)/100 + '%</td></tr>');
    $('#data-table').append('<tr><td>Admissions Rate</td><td>' + Math.round(10000 *  school.ADM_RATE_ALL)/100 + '%</td></tr>');

    var make = true;
    for (var key in demo) {
        if (isNaN(demo[key]))
        {
            make = false;
        }


    }
    if (make)
    {
        makePieChart(svgDem, demo, demKey);
    }
    else
    {
        $("#race").css("display","none");
    }
    make = true;
    for (var key in par) {
        if (isNaN(par[key]))
        {
            make = false;
        }


    }
    if (make)
    {
        makePieChart(parDem, par, parKey);
    }
    else
    {
        $("#education").css("display","none");
    }

    make = true;
    for (var key in inc) {
        if (isNaN(inc[key]))
        {
            make = false;
        }


    }
    if (make)
    {
        makePieChart(incDem, inc, incKey);
    }
    else
    {
        $("#income").css("display","none");
    }
}


function makePieChart(svg, data,key)
{
    var path = svg.datum(data).selectAll("path")
        .data(pie)
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .each(function(d) { this._current = d; }); // store the initial angles

    var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d,k) {
            return key(d,k);
        });

    text.transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        });

    text.exit()
        .remove();

    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();
}

