/**
 * Created by erikgodard on 4/15/16.
 */

var allData = [];
var currData = [];
// Variable for the visualization instance
var stationMap;

var criteria = {
    ADM_RATE_ALL: {
        min: 0,
        max: 100
    }

};

// Start application by loading the data
loadData();





function loadData() {
   /* $('.valueWrap').children('div').each(function(i) {
        $(this).rangeSlider({
            bounds:
            {
                min: 0,
                max: 100
            },
            defaultValues:
            {
                min: 0,
                max: 100
            },
            step: 1
        });
    });*/

    $("#ADM_RATE_ALL").rangeSlider({
        bounds:
        {
            min: 0,
            max: 100
        },
        defaultValues:
        {
            min: 0,
            max: 100
        },
        step: 1
    });

    $("#ADM_RATE_ALL").bind("valuesChanged", function(e, data){
        updateCriteria(e,data);
        filterData();

        //upper limit for map, switch to chloropleth if greater
        if (currData.length > 500)
        {

        }
        else
        {
            updateVis();
        }
    });



    // Load CSV file
    d3.csv("data/data.csv", function(data) {
        allData = data.filter(function(d,i) {
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

            if (i < 1000 && !isNaN(d.LONGITUDE) && !isNaN(d.LATITUDE))
            {
                return d;
            }

        });
        // Store csv data in global variable

        console.log(data);

        createVis();
    });



}

function updateCriteria(e,data)
{
    var basicValues = $(e.currentTarget).rangeSlider("values");
    criteria[e.currentTarget.id].min = basicValues['min'];
    criteria[e.currentTarget.id].max = basicValues['max'];
}

function filterData()
{
    var keys = Object.keys(criteria);

    currData = allData.filter(function(item)
    {
        out = true;

        for (var i = 0; i < keys.length; ++i)
        {
            var val = item[keys[i]];
            out = !isNaN(val) && val >= criteria[keys[i]]["min"]/100.0 && val <= criteria[keys[i]]["max"]/100.0;
            if (out == false)
            {
                break;
            }
        }
        if (out == true)
        {
            return item;
        }
    });
    stationMap.data = currData;
   console.log(currData.length);
}

function createVis() {

    // TO-DO: INSTANTIATE VISUALIZATION

    stationMap = new CollegeMap("college-map", allData, [42.360082, -91.058880]);
    stationMap.initVis();

}

function updateVis()
{
    stationMap.updateVis();
}