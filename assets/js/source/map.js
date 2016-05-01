/**
 * Created by erikgodard on 4/15/16.
 */

var maxDrops = 300;

// Data containers
var allData = [];
var currData = [];

// Variable for the visualization instance
var stationMap;

var criteria = {
    ADM_RATE_ALL: {
        min: 0,
        max: 100
    },
    SAT_AVG_ALL: {
        min: 400,
        max: 1600
    },
    TUITFTE: {
        min: 0,
        max: 70000
    },
    INEXPFTE: {
        min: 0,
        max: 50000
    },
    UGDS: {
        min: 0,
        max: 30000
    },
    RET_FT4: {
        min: 0,
        max: 100
    },
    PCTFLOAN: {
        min: 0,
        max: 100
    },
    PCTPELL: {
        min: 0,
        max: 100
    },
    GRAD_DEBT_MDN_SUPP: {
        min: 0,
        max: 100000
    },
    C150_4: {
        min: 0,
        max: 100
    },
    C200_4: {
        min: 0,
        max: 100
    }

};


// Start application by loading the data
loadData();

$("#public").change(function(){
    filterData();
    updateVis();
});

$("#private").change(function(){
    filterData();
    updateVis();
});

$("#womenonly").change(function(){
    filterData();
    updateVis();
});

$("#hbcu").change(function(){
    filterData();
    updateVis();
});




function loadData() {
    // Bind event handlers to each slider
    $('.select-slider').each(function(i) {
        $(this).slider({
            range: true,
            min: criteria[this.id]["min"],
            max: criteria[this.id]["max"],
            values: [criteria[this.id]["min"], criteria[this.id]["max"]],
            slide: function (event, ui) {
                updateCriteria(event, ui);
                filterData();
                updateVis();
            }
        }).bind("change", function(e, data){
            updateCriteria(e,data);
            filterData();
            console.log("here");
            //upper limit for map, switch to chloropleth if greater
        }).slider("pips", {
        rest: "label", 
        step: (criteria[this.id]["max"] - criteria[this.id]["min"]) / 4,
        first: 'label', 
        label: 'label'
    })
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

            if (!isNaN(d.LONGITUDE) && !isNaN(d.LATITUDE))
            {
                return d;
            }

        });
        // Store csv data in global variable
        createVis();
    });



}

function updateCriteria(event, e)
{
    criteria[event.target.id].min = e.values["0"];
    criteria[event.target.id].max = e.values["1"];
}

//Place the data subject to the current constraints into currData
function filterData()
{
    var keys = Object.keys(criteria);

    //checkbox
    var pub = ($("#public").is(":checked")) ? "1" : "0";
    var priv = ($("#private").is(":checked")) ? "1" : "0";
    var womenonly = ($("#womenonly").is(":checked")) ? "1" : "0";
    var hbcu = ($("#hbcu").is(":checked")) ? "1" : "0";

    currData = allData.filter(function(item)
    {
        out = true;

        for (var i = 0; i < keys.length; ++i)
        {
            var val = item[keys[i]];
            var mult = (keys[i] == "SAT_AVG_ALL" || keys[i] == "TUITFTE" || keys[i] == "INEXPFTE" ||
            keys[i] == "UGDS" || keys[i] == "GRAD_DEBT_MDN_SUPP") ? (1) : 100.0;
            out = !isNaN(val) && val >= criteria[keys[i]]["min"]/mult && val <= criteria[keys[i]]["max"]/mult;
            if (out == false)
            {
                break;
            }
        }
        out = out && ((item["CONTROL"] == "1" && pub == "1") ||((item["CONTROL"] == "2" || item["CONTROL"] == "3") && priv == "1")|| (item["WOMENONLY"] == womenonly && womenonly == "1") || (item["HBCU"] == hbcu && hbcu == "1"));
        if (out == true)
        {
            return item;
        }
    });
    if (currData.length > maxDrops)
    {
        stationMap.shouldDraw = false;
    }
    else
    {
        stationMap.shouldDraw = true;
    }
    stationMap.data = currData;
}

function createVis() {

    stationMap = new CollegeMap("college-map", allData, [42.360082, -91.058880]);
    filterData();
    stationMap.initVis();

}

function updateVis()
{
    stationMap.updateVis();
}