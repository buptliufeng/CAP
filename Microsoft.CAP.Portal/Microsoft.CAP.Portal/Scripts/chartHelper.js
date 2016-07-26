//change json data (e.g. "/Date(1000000000000)/" ) to Date()
function formatJsonDate(results) {
    for (var index in results) {
        results[index].Timestamp = new Date(parseInt(results[index].Timestamp.substr(6)));
    }
}

//default: show the last showNum points 
function getShowDate(results, showNum) {
    var pointsLength = results.length;
    var from, to;
    if (pointsLength > showNum)
        from = results[pointsLength - showNum].Timestamp;
    else from = results[0].Timestamp;
    to = results[pointsLength - 1].Timestamp;
    var showDate = {
        from: from,
        to: to
    }
    return showDate;
}

function getAnomalyPoints(results) {
    for (var index in results) {
        if (results[index].IsAnomaly == true)
            results[index].AnomalyValue = results[index].Value;
        else
            results[index].AnomalyValue = null;
    }
}

function createChartParams(chartTitle, results) {
    //pre-processing
    formatJsonDate(results);
    getAnomalyPoints(results);
    var showDate = getShowDate(results, 288);
    var labelParams = getLabelParams(showDate.from,showDate.to);

    var chartParams = {
        title: {
            text: chartTitle
        },
        legend: {
            position: "bottom",
            visible: true
        },
        chartArea: {
            height: 512 //set height to be 512px
        },
        seriesDefaults: {
            type: "line"
        },
        dataSource: results,
        dateField: "Timestamp",
        series: [{
            name: "LowerBound", 
            field: "LowerBound",
            color: "gold",
            zIndex: 1,
            markers: {
                visible: false
            },
            highlight: {
                visible: false
            },
            tooltip: {
                visible: false
            }
        }, {
            name: "UpperBound", 
            field: "UpperBound",
            color: "gold",
            zIndex: 1,
            markers: {
                visible: false
            },
            highlight: {
                visible: false
            },
            tooltip: {
                visible: false
            }
        }, {
            name: "Value",  
            field: "Value",
            color: "deepskyblue",
            zIndex: 2,
            markers: {
                size: 2
            },
            tooltip: {
                visible: true,
                opacity:0.8,
                template: "Timestamp: #=dataItem.Timestamp # <br>\
                               Value: #= dataItem.Value # <br>\
                               IsAnomaly: #= dataItem.IsAnomaly # <br>\
                               ExpectedValue: #= dataItem.ExpectedValue # <br>\
                               LowerBound: #= dataItem.LowerBound # <br>\
                               UpperBound: #= dataItem.UpperBound # <br>\
                               ConfidenceIndex: #= dataItem.ConfidenceIndex #",
            }
        }, {
            name: "Anomaly",  
            field: "AnomalyValue",
            color: "red",
            opacity: 0, //hide the line
            missingValues: "gap",   //not show the null points
            zIndex: 3,  //set Anomaly to be the top layer
            markers: {
                size: 2,
            },
            tooltip: {
                visible: false
            }
        }],
        valueAxis: { 
            labels: {
                template: "#= value#"
            }
        },
        categoryAxis: {
            baseUnit: "minutes",
            baseUnitStep: 5,//Take 5 minutes as the minimun interval at first
            labels: {
                format: labelParams.format,
                skip:labelParams.skip,
                step:labelParams.step,
            }
        },
        navigator: {//the slide window
            series: [{
                type: "line",
                field: "Value",
                color: "deepskyblue"
            }, {
                type: "line",
                field: "UpperBound",
                color: "gold"
            }, {
                type: "line",
                field: "LowerBound",
                color: "gold"
            }, {
                type: "area",//make the anomaly obvious
                field: "AnomalyValue",
                color: "red",
            }],
            select: {
                from: showDate.from,
                to: showDate.to
            },
            hint:{
                visible:false
            }
        },
        transitions: false,//don't show the redraw animation

        //event when zoom with mousewheel or select on the navigator
        zoomEnd:navigatorChange,
        selectEnd: navigatorChange,
    };
    return chartParams;
}

//change json data (e.g. "/Date(1000000000000)/" ) to Date()
function formatJsonDate(results) {
    for (var index in results) {
        results[index].Timestamp = new Date(parseInt(results[index].Timestamp.substr(6)));
    }
}

//default: show the last showNum points 
function getShowDate(results, showNum) {
    var pointsLength = results.length;
    var from, to;
    if (pointsLength > showNum)
        from = results[pointsLength - showNum].Timestamp;
    else from = results[0].Timestamp;
    to = results[pointsLength - 1].Timestamp;
    var showDate = {
        from: from,
        to: to
    }
    return showDate;
}

function getAnomalyPoints(results) {
    for (var index in results) {
        if (results[index].IsAnomaly == true)
            results[index].AnomalyValue = results[index].Value;
        else
            results[index].AnomalyValue = null;
    }
}

function navigatorChange(e)
{
    var axisArray = e.sender.options.categoryAxis;
    var timeAxis = axisArray[0];//get the categoryAxis we define above
    var newFrom = timeAxis.min;
    var newTo = timeAxis.max;
    var newParams = getLabelParams(newFrom, newTo);
    timeAxis.labels.format = newParams.format;
    timeAxis.labels.step = newParams.step;
    timeAxis.labels.skip = newParams.skip;

    //update categoryAxis configuration
    e.sender.redraw();
}

function getLabelParams(from,to)
{
    var diff = to- from;
    var timeUnit = calcTimeUnit(diff);

    var unitStep=5;
    var minuteStep = 0.2, //a step is 5 min
        hourStep = 12,
        dayStep = hourStep * 24,
        weekStep = dayStep * 7;

    var params = new Object();
    switch(timeUnit)
    {
        case "week": {
            params.step = weekStep;
            params.format = "MM/dd";
            params.skip = (from.getHours()==0)?0:(24 - from.getHours()) * hourStep; //show labels when hour=0
            break;
        }
        case "day": {
            params.step = dayStep;
            params.format = "MM/dd";
            params.skip = (from.getHours() == 0) ? 0 : (24 - from.getHours()) * hourStep; //show labels when hour=0
            break;
        }
        case "hour": {
            params.step = hourStep * 3; //show label every 3 hour
            params.format = "HH:mm";
            params.skip = (from.getMinutes())?0:(60 - from.getMinutes())*minuteStep;   //show labels when minute=0 
            break;
        }
        case "minute": {
            params.step = minuteStep * 30;//show label every 30 min 
            params.format = "HH:mm";
            params.skip = 0;
            break;
        }
    }
    return params;
}

function calcTimeUnit(timeDiff)
{
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
    if (timeDiff / week >= 2) return "week";
    else if (timeDiff / day >= 2) return "day";
    else if (timeDiff / hour >= 2) return "hour";
    else return "minute";
}