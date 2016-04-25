/**
 * Created by erikgodard on 4/13/16.
 */

loadData();

allData = {};

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

            if (!isNaN(d.LONGITUDE) && !isNaN(d.LATITUDE))
            {
                return d;
            }



        });
        // Store csv data in global variable
        createVis();
    });



}


function createVis()
{
    console.log(getParameterByName("s"));
    var school = allData[getParameterByName("s")];

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




}