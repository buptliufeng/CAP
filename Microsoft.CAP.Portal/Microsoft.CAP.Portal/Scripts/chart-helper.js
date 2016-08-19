function createChartParams(chartTitle, results, intervalMinutes) {
    if (results == null) {
        //return an empty chart if no results
        return {
            title: {
                text:chartTitle
            },
            chartArea: {
                height: 450, //set height to be 450px
            },
            valueAxis: {
                labels: {
                    template: "#= value #"
                }
            }
        }
    }

    //pre-processing
    formatJsonDate(results);
    getAnomalyPoints(results);
    var showDateRange = getShowDateRange(results, 288);
    var labelParams = getLabelParams(showDateRange.from, showDateRange.to, intervalMinutes);

    var chartParams = {
        title: {
            text: chartTitle
        },
        legend: {
            position: "bottom",
            visible: true
        },
        chartArea: {
            height: 450 //set height to be 450px
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
                opacity: 0.8,
                template: "Timestamp: #= dataItem.Timestamp # <br>\
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
                size: 4,
                background:"red"
            },
            tooltip: {
                visible: true,
                opacity: 0.8,
                background: "deepskyblue",
                border: {
                    color: "deepskyblue"
                },//in accord with normal points
                template: "Timestamp: #= dataItem.Timestamp # <br>\
                               Value: #= dataItem.Value # <br>\
                               IsAnomaly: #= dataItem.IsAnomaly # <br>\
                               ExpectedValue: #= dataItem.ExpectedValue # <br>\
                               LowerBound: #= dataItem.LowerBound # <br>\
                               UpperBound: #= dataItem.UpperBound # <br>\
                               ConfidenceIndex: #= dataItem.ConfidenceIndex #",
            }
        }],
        valueAxis: {
            labels: {
                template: "#= value #"
            }
        },
        categoryAxis: {
            baseUnit: "minutes",
            baseUnitStep: intervalMinutes,
            labels: {
                format: labelParams.format,
                skip: labelParams.skip,
                step: labelParams.step,
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
                type: "column",//make the anomaly obvious
                field: "AnomalyValue",
                color: "red",
                gap: 3
            }],
            select: {
                from: showDateRange.from,
                to: showDateRange.to
            },
            hint: {
                visible: false
            }
        },
        transitions: false,//don't show the redraw animation

        //event when zoom with mousewheel or select on the navigator
        zoomEnd: onNavigatorChanged,
        selectEnd: onNavigatorChanged,
    };
    return chartParams;
}

//convert JSON date string to Date()
function formatJsonDate(results) {
    for (var index in results) {
        results[index].Timestamp = new Date(results[index].Timestamp);
    }
}

//default: show the last showNum points 
function getShowDateRange(results, showNum) {
    var pointsLength = results.length;
    var from, to;
    if (pointsLength > showNum)
        from = results[pointsLength - showNum].Timestamp;
    else from = results[0].Timestamp;
    to = results[pointsLength - 1].Timestamp;
    var showDateRange = {
        from: from,
        to: to
    }
    return showDateRange;
}

function getAnomalyPoints(results) {
    for (var index in results) {
        if (results[index].IsAnomaly == true)
            results[index].AnomalyValue = results[index].Value;
        else
            results[index].AnomalyValue = null;
    }
}

function onNavigatorChanged(e) {
    var axisArray = e.sender.options.categoryAxis;
    var timeAxis = axisArray[0];//get the categoryAxis we define above
    var minutePerStep = timeAxis.baseUnitStep;
    var newFrom = timeAxis.min;
    var newTo = timeAxis.max;
    var newParams = getLabelParams(newFrom, newTo, minutePerStep);
    timeAxis.labels.format = newParams.format;
    timeAxis.labels.step = newParams.step;
    timeAxis.labels.skip = newParams.skip;

    //update categoryAxis configuration
    e.sender.redraw();
}

function getLabelParams(from, to, minutePerStep) {
    var diff = to - from;
    var timeUnit = calcCategoryAxisTimeUnit(diff);

    var stepPerMinute = 1 / minutePerStep,
        stepPerHour = stepPerMinute * 60,
        stepPerDay = stepPerHour * 24,
        stepPerWeek = stepPerDay * 7;

    var params = new Object();
    switch (timeUnit) {
        case "week": {
            params.step = stepPerWeek;
            params.format = "MM/dd";
            params.skip = (from.getHours() == 0) ? 0 : (24 - from.getHours()) * stepPerHour; //start show labels when hour=0
            break;
        }
        case "day": {
            params.step = stepPerDay;
            params.format = "MM/dd";
            params.skip = (from.getHours() == 0) ? 0 : (24 - from.getHours()) * stepPerHour; //start show labels when hour=0
            break;
        }
        case "hour": {
            params.step = stepPerHour * 3; //show label every 3 hour
            params.format = "HH:mm";
            params.skip = (from.getMinutes() == 0) ? 0 : (60 - from.getMinutes()) * stepPerMinute;   //start show labels when minute=0 
            break;
        }
        case "minute": {
            params.step = stepPerMinute * 30;//show label every 30 min 
            params.format = "HH:mm";
            params.skip = 0;
            break;
        }
    }
    return params;
}

function calcCategoryAxisTimeUnit(timeDiff) {
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