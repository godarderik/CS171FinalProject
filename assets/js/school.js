/**
 * Created by erikgodard on 4/13/16.
 */

//pie chart visualization
var width = 750,
    height = 450,
    radius = Math.min(width, height) / 2;


var pie = d3.layout.pie()
    .value(function(d) { return d})
    .sort(null);

var arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

// bar chart visualization
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var barWidth = 700 - margin.left - margin.right,
    barHeight = 500 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .rangeRoundBands([0, barWidth - 200], .5);

var y = d3.scale.linear()
    .rangeRound([barHeight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var pieColor = d3.scale.category20();

var color = d3.scale.category20();
var color2 = d3.scale.category20();
var color3 = d3.scale.category20();



//svg containers
var svgDem;
var parDem;
var incDem;

var orgData;


//data
allData = {};
demoData = {};
incData = {};
parData = {};
schools = [];
dataBySchool = {};


loadData();

//selected schools
var schoolPrimary;
var schoolSecondary;

//For barchart compatibility
var choice1;
var choice2;


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

    schoolPrimary = getParameterByName("s");
    numSchools = 1;
    console.log(schoolPrimary);
    d3.csv("data/data.csv", function(data) {
        console.log(schoolPrimary);
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

            dataBySchool[d.INSTNM] = d;
            schools.push(d.INSTNM);

            if (!isNaN(d.LONGITUDE) && !isNaN(d.LATITUDE))
            {
                return d;
            }



        });
    
    orgData = data;
    orgData1 = data;
    orgData2 = data;

    //potential problem here
    color.domain(d3.keys(orgData[0]).filter(function(key) {
        return key == "UGDS_WHITE" || key == "UGDS_BLACK" || key == "UGDS_HISP" || key == "UGDS_ASIAN" ||
            key == "UGDS_AIAN" || key == "UGDS_2MOR" || key == "UGDS_NRA" || key == "UGDS_UNKN";
    }));

    color2.domain(d3.keys(orgData1[0]).filter(function(key) {
        return key == "INC_PCT_LO" || key == "INC_PCT_M1" || key == "INC_PCT_M2" || key == "INC_PCT_H1" ||
            key == "INC_PCT_H2";
    }));

    color3.domain(d3.keys(orgData2[0]).filter(function(key) {
        return key == "PAR_ED_PCT_MS" || key == "PAR_ED_PCT_PS" || key == "PAR_ED_PCT_HS";
    }));



    orgData.forEach(function (d) {
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

    orgData1.forEach(function (d) {
        var y0 = 0;
        d.categories1 = color2.domain().map(function (name) {
            if (!isNaN(d[name])) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            }
            else {
                return {name: name, y0: y0, y1: y0};
            }
        });
    });

    orgData2.forEach(function (d) {
        var y0 = 0;
        d.categories2 = color3.domain().map(function (name) {
            if (!isNaN(d[name])) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            }
            else {
                return {name: name, y0: y0, y1: y0};
            }
        });
    });


    ///
    $( "#compareschool" ).autocomplete({
      source: schools,
      select: function (a, b) {
        $(this).val(b.item.value);
        if ( this.value in dataBySchool)
        {
            updateSchool(1, dataBySchool[this.value]);
        }
    }
    }).attr('size',60).on("input", function()
    {
        if ($(this).val() == "")
        {
            schoolSecondary = undefined;
            createTable();
            updateVisualizations();
        }
    });

    $( "#school-name-header" ).autocomplete({
      source: schools,
      select: function (a, b) {
        $(this).val(b.item.value);
        if ( this.value in dataBySchool)
        {
            updateSchool(0, dataBySchool[this.value]);
        }
    }
    }).attr('size',60).on("input", function()
    {
        if ($(this).val() == "")
        {
            schoolPrimary = undefined;
            createTable();
            updateVisualizations();
        }
    });

     $( "#school-name-header" ).val(allData[schoolPrimary].INSTNM);

        createTable();
        updateVisualizations();
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

function schoolToArray(school)
{
    var schoolPrimaryArray = [];
    
    if (school == undefined) return ["","","","","","","","","","","",""];

    schoolPrimaryArray.push((school.CONTROL == 0 ? "Public" : "Private"));
    schoolPrimaryArray.push(school.UGDS);
    schoolPrimaryArray.push(accounting.formatMoney(school.TUITFTE));
    schoolPrimaryArray.push(school.SAT_AVG_ALL);
    schoolPrimaryArray.push((Math.round(10000 * school.C150_4)/100).toString() + "%");
    schoolPrimaryArray.push((Math.round(10000 *  school.C200_4)/100).toString() + "%");
    schoolPrimaryArray.push((Math.round(10000* school.PCTPELL)/100).toString() + "%");
    schoolPrimaryArray.push((Math.round(10000 * school.PCTFLOAN)/100).toString() + "%");
    schoolPrimaryArray.push(accounting.formatMoney(school.GRAD_DEBT_MDN_SUPP));
    schoolPrimaryArray.push((Math.round(10000 * school.RET_FT4)/100).toString() + "%");
    schoolPrimaryArray.push((Math.round(10000 *  school.ADM_RATE_ALL)/100).toString() + "%");

    return schoolPrimaryArray;
}

function createTable()
{
    console.log(schoolPrimary, schoolSecondary);
    if (schoolPrimary == undefined && schoolSecondary == undefined) return;
    
    var schoolPrimaryArray = schoolToArray(allData[schoolPrimary]);
    var schoolSecondaryArray = schoolToArray(allData[schoolSecondary]);

    $("#data-table").empty();

    if (schoolPrimary !== undefined && schoolSecondary !== undefined)
    {
        $('#data-table').append('<tr><th></th><th id = "school1">' + allData[schoolPrimary].INSTNM + '</th><th id = "school1">' + allData[schoolSecondary].INSTNM + '</th></tr>');
    }
    else
    {   
        var str = schoolPrimary == undefined ? allData[schoolSecondary].INSTNM  : allData[schoolPrimary].INSTNM;
        $('#data-table').append('<tr><th></th><th id = "school1">' + str+ '</th></tr>');
    }

    if (schoolPrimaryArray[0] == "")
    {
        var t = schoolPrimaryArray;
        schoolPrimaryArray = schoolSecondaryArray;
        schoolSecondaryArray = t;
    }
    
    $('#data-table').append('<tr><td>School Type</td><td>' + schoolPrimaryArray[0] + '</td><td>' + schoolSecondaryArray[0] + '</td></tr>');
    $('#data-table').append('<tr><td>Total Undergraduates</td><td>' + schoolPrimaryArray[1] + '</td><td>' + schoolSecondaryArray[1] + '</td></tr>');
    $('#data-table').append('<tr><td>Tuition</td><td>' + schoolPrimaryArray[2] + '</td><td>' + schoolSecondaryArray[2] + '</td></tr>');
    $('#data-table').append('<tr><td>Average SAT Score</td><td>' + schoolPrimaryArray[3] + '</td><td>' + schoolSecondaryArray[3] + '</td></tr>');
    $('#data-table').append('<tr><td>Six Year Graduation Rate</td><td>' + schoolPrimaryArray[4] + '</td><td>' + schoolSecondaryArray[4] + '</td></tr>');
    $('#data-table').append('<tr><td>Eight Year Graduation Rate</td><td>' + schoolPrimaryArray[5] + '</td><td>' + schoolSecondaryArray[5]+ '</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Student Receiving Pell Grants</td><td>' + schoolPrimaryArray[6] + '</td><td>' + schoolSecondaryArray[6] + '</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Student Receiving Federal Loans</td><td>' + schoolPrimaryArray[7] + '</td><td>' + schoolSecondaryArray[7] + '</td></tr>');
    $('#data-table').append('<tr><td>Median Debt of Graduates</td><td>' + schoolPrimaryArray[8] + '</td><td>' + schoolSecondaryArray[8] + '</td></tr>');
    $('#data-table').append('<tr><td>Percentage of Students Returning After First Year</td><td>' + schoolPrimaryArray[9] + '</td><td>' + schoolSecondaryArray[9] + '</td></tr>');
    $('#data-table').append('<tr><td>Admissions Rate</td><td>' + schoolPrimaryArray[10] + '</td><td>' + schoolSecondaryArray[10] + '</td></tr>');

}
function createVis(schoolType)
{
    var demo = demoData[schoolType];
    var par = parData[schoolType];
    var inc = incData[schoolType];

    var make = true;
    for (var key in demo) {
        if (isNaN(demo[key]))
        {
            make = false;
        }


    }
    if (make)
    {
        $("#school1-visualization").append("<h3 id = 'race'>Student Body by Race</h3>");
        svgDem = d3.select("#school1-visualization").append("svg")
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
        $("#school2-visualization").append("<h3 id = 'education'>Student Body by Parent's Level of Education</h3>");
        parDem = d3.select("#school2-visualization").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "vis")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        parDem.append("g")
        .attr("class", "slices");
        
        parDem.append("g")
        .attr("class", "labels");
        
        parDem.append("g")
        .attr("class", "lines");
        
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
        $("#school3-visualization").append("<h3 id = 'income'>Student Body by Parent's Income</h3>");
        incDem = d3.select("#school3-visualization").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "vis")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        incDem.append("g")
        .attr("class", "slices");
        
        incDem.append("g")
        .attr("class", "labels");
        
        incDem.append("g")
        .attr("class", "lines");
        
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
        .attr("fill", function(d, i) { return pieColor(i); })
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


function updateSchool(schoolNumber, schoolData)
{
    if (schoolNumber == 0) schoolPrimary    = schoolData.UNITID;
    else schoolSecondary                    = schoolData.UNITID;

    createTable();
    updateVisualizations();

}

function updateVisualizations()
{

    $("#school1-visualization").empty();
    $("#school2-visualization").empty();
    $("#school3-visualization").empty();

    if (schoolPrimary !== undefined && schoolSecondary == undefined) createVis(schoolPrimary);
    else if (schoolPrimary == undefined && schoolSecondary !== undefined) createVis(schoolSecondary);
    else if (schoolPrimary !== undefined && schoolSecondary !== undefined)
    {
        choice1 = allData[schoolPrimary].INSTNM;
        choice2 = allData[schoolSecondary].INSTNM;
        makeBarcharts();
    }
}

function makeBarcharts()
{
    x.domain([choice1, choice2]);
    y.domain([0,1]);

    $("#school1-visualization").append("<h3 id = 'race'>Student Body by Race</h3>");
    makeBarchart("#school1-visualization","School Names", "Percent of Undergraduates By Race", 0,raceMap,color,orgData);
    
    $("#school2-visualization").append("<h3 id = 'education'>Student Body by Parent's Level of Education</h3>");
    makeBarchart("#school2-visualization","School Names", "Percent of Undergraduates By Parents' Highest Education Level",2, edMap,color3,orgData2);

    $("#school3-visualization").append("<h3 id = 'income'>Student Body by Parent's Income</h3>");
    makeBarchart("#school3-visualization","School Names", "Percent of Undergraduates By Family Income", 1,incMap,color2,orgData1);

    

}

function makeBarchart(tag, xtitle, ytitle, type, mapFunc,colorFunc,data)
{
    var svg = d3.select(tag).append("svg")
    .attr("width", barWidth + margin.left + margin.right)
    .attr("height", barHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + barHeight + ")")
            .call(xAxis)
            .append("text")
            .attr("x", barWidth - 125)
            .attr("y", -5)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(xtitle);

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90) translate(0, -50)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(ytitle);

    svg.selectAll("g.x-axis")
        .transition()
        .duration(800)
        .call(xAxis);

    var clear = svg.append("rect")
        .attr("x", 1)
        .attr("y", 0)
        .attr("width", 350)
        .attr("height", 400)
        .attr("fill", "white");

    var missing0 = svg.append("text")
        .attr("x", 90)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px")

    var missing1 = svg.append("text")
        .attr("x", 250)
        .attr("y", 200)
        .text("Missing Data")
        .attr("font-size", "11px");

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
            if (type == 0) return d.categories;
            else if (type == 1) return d.categories1;
            else if (type == 2) return d.categories2;

            
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
            return colorFunc(d.name);
        });

    var legend = svg.selectAll(".legend")
        .data(colorFunc.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", barWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorFunc);

    legend.append("text")
        .attr("x", barWidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return mapFunc(d);
        });

}

function raceMap(d)
{
    if (d == "UGDS_WHITE") { return "White"; }
    else if (d == "UGDS_BLACK") { return "Black"; }
    else if (d == "UGDS_HISP") { return "Hispanic"; }
    else if (d == "UGDS_ASIAN") { return "Asian"; }
    else if (d == "UGDS_AIAN") { return "American Indian/Alaska Native"; }
    else if (d == "UGDS_2MOR") { return "Two or more races"; }
    else if (d == "UGDS_NRA") { return "Non-resident aliens"; }
    else if (d == "UGDS_UNKN") { return "Race unknown"; }
}

function incMap(d)
{
    if (d == "INC_PCT_LO") { return "$0-$30,000"; }
    else if (d == "INC_PCT_M1") { return "$30,001-$48,000"; }
    else if (d == "INC_PCT_M2") { return "$48,001-$75,000"; }
    else if (d == "INC_PCT_H1") { return "$75,001-$110,000"; }
    else if (d == "INC_PCT_H2") { return "$110,001+"; }
}

function edMap(d)
{
    if (d == "PAR_ED_PCT_MS") { return "Middle School"; }
    else if (d == "PAR_ED_PCT_HS") { return "High School"; }
    else if (d == "PAR_ED_PCT_PS") { return "Post-Secondary Education"; }
}

