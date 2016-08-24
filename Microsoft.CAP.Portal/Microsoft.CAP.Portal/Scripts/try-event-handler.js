var tryDataSet = null;

function onCsvSelected(event) {
    var selectedFile = event.target.files[0];
    if (selectedFile) {
        $("#csv-name").val("loading data...");
        $("#trial-one-btn").prop("disabled", true);
        $("#trial-two-btn").prop("disabled", true);

        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (readerEvent) {
            tryDataSet = csvToArray(readerEvent.target.result);

            //dataset is loaded
            if (tryDataSet.length >= 2) {
                var firstTimestamp = new Date(tryDataSet[0].Timestamp);
                var secondTimestamp = new Date(tryDataSet[1].Timestamp);
                var lastTimestamp = new Date(tryDataSet[tryDataSet.length - 1].Timestamp);
                var intervalSecs = (secondTimestamp - firstTimestamp) / 1000;

                $("#interval-seconds").val(intervalSecs);
                $("#time-range").html("Time Range:" + formatDateString(firstTimestamp) + " - " + formatDateString(lastTimestamp));
                $("#start-time").prop("disabled", false);
                $("#start-time").datepicker("option", {
                    minDate: firstTimestamp,
                    maxDate: lastTimestamp
                });

                //show dataset
                $("#trial-one-chart").kendoStockChart(createChartParams("Trial one", tryDataSet, intervalSecs / 60));
            }

            var fullPath = $("#csv-selector").val();
            var csvName = fullPath.substring(fullPath.lastIndexOf("\\") + 1);
            $("#csv-name").val(csvName);
            $("#csv-selector").val("");//enable reloading file

            $("#trial-one-btn").prop("disabled", false);
            $("#trial-two-btn").prop("disabled", false);
        }
    }
}

function onTryClicked(event) {
    var trialNumStr = event.data.trialNumStr;
    $("#trial-" + trialNumStr + "-loader").show();
    $("#trial-" + trialNumStr + "-btn").prop("disabled", true);

    var tryParams = new Object();
    $("#trial-" + trialNumStr + "-parameters").find("input").each(function () {
        if ($(this).val() != "") {
            tryParams[this.name] = this.value;
        }
    });

    var tryRequest = {
        StreamId: "try stream",
        EngineId: $("#trial-" + trialNumStr + "-engine").val(),
        DataType: $("#data-type").val(),
        DataIntervalSeconds: $("#interval-seconds").val(),
        Parameters: tryParams,
        DataSet: tryDataSet,
        DetectionStartTime: $("#start-time").val()
    };

    $.ajax({
        url: tryUrl,
        type: "POST",
        data: JSON.stringify(tryRequest),
        contentType: "application/json",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (tryResponse) {
            var results = tryResponse.Results;
            var intervalMinutes = tryResponse.DataIntervalSeconds / 60;
            $("#trial-" + trialNumStr + "-chart").kendoStockChart(createChartParams("Trial " + trialNumStr, results, intervalMinutes));

            updateTrialParams(tryResponse.Parameters, trialNumStr);
            $("#trial-" + trialNumStr + "-engine").val(tryResponse.EngineId);//show the default engine when user choose "any"
            $("#data-type").val(tryResponse.DataType);//update datatype
        },
        complete: function () {
            $("#trial-" + trialNumStr + "-btn").prop("disabled", false);
            $("#trial-" + trialNumStr + "-loader").hide();
        }
    })

}

//for user to specify DataPeriod when stream is periodic
function onDataTypeChanged() {
    if ($("#data-type").val() == 0) {
        $("[name=DataPeriod]").val("");
        $("[name=DataPeriod]").parents(".form-group").hide();
    }
    else {
        $("[name=DataPeriod]").parents(".form-group").show();
    }
}

function csvToArray(csvText) {
    var dataSet = new Array();
    var rows = csvText.split(/\r\n|\n/);
    for (rowIndex = 1; rowIndex < rows.length - 1; rowIndex++)//ignore table header and EOF
    {
        var colsPerRow = rows[rowIndex].split(/,|\t/);
        if (colsPerRow.length == 2) {
            dataSet.push({
                Timestamp: colsPerRow[0],
                Value: colsPerRow[1]
            });
        }
    }
    return dataSet;
}

function formatDateString(dateObj) {
    var month = dateObj.getMonth() + 1;
    var day = dateObj.getDate();
    var year = dateObj.getFullYear();
    return month + "/" + day + "/" + year;
}

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    if (jqxhr.statusText == "Bad Request") {
        var errorObject = jqxhr.responseJSON;
        var errorText = "ErrorCode = " + errorObject.ErrorCode + "\nErrorMessage = " + errorObject.ErrorMessage;
    }
    else// Deal with other standard HttpStatusCode such as 500 for InternalServerError
    {
        var errorText = jqxhr.responseText == null ? "null" : jqxhr.responseText;
    }
    alert(jqxhr.statusText + "\n" + errorText);
});

function onSaveClicked(event) {
    var trialNumStr = event.data.trialNumStr;

    var historyParams = new Object();
    $("#trial-" + trialNumStr + "-parameters").find("input").each(function () {
        historyParams[this.name] = this.value;
    })
    var config = {
        DataType: $("#data-type").val(),
        DataIntervalSeconds: $("#interval-seconds").val(),
        DetectionStartTime: $("#start-time").val(),
        EngineId: $("#trial-" + trialNumStr + "-engine").val(),
        Parameters: historyParams
    };

    //save config locally
    var configBlob = new Blob([JSON.stringify(config)], { type: "application/json" });
    var csvName = $("#csv-name").val();
    var defaultName = csvName.substring(0, csvName.lastIndexOf(".")) + ".json";//replace ".csv" with ".json" to form a default name 
    window.navigator.msSaveBlob(configBlob, defaultName);
}

function onLoadClicked(event) {
    var selectedFile = event.target.files[0];
    if (selectedFile) {
        var trialNumStr = event.data.trialNumStr;
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (readerEvent) {
            try {
                //load saved config
                var localConfig = JSON.parse(readerEvent.target.result);
                $("#data-type").val(localConfig.DataType);
                $("#interval-seconds").val(localConfig.DataIntervalSeconds);
                $("#start-time").val(localConfig.DetectionStartTime);
                $("#trial-" + trialNumStr + "-engine").val(localConfig.EngineId);
                updateTrialParams(localConfig.Parameters, trialNumStr);
            }
            catch (e) {
                alert("JSON.parse() failed: " + e.message);
            }

            $("#trial-" + trialNumStr + "-load-btn").val("");//enable reloading file
        };
    }
}

function updateTrialParams(params, trialNumStr) {
    $("#trial-" + trialNumStr + "-parameters").empty();
    $.each(params, function (key, val) {
        var oneEditParam = $("<div/>", { "class": "form-group" });
        oneEditParam.append($("<div/>", { "class": "col-xs-5" }).append(
            $("<label/>", {
                "class": "control-label",
                "for": "trial-" + trialNumStr + "-" + key,
                text: key + ":"
            })
        ));
        oneEditParam.append($("<div/>", { "class": "col-xs-7" }).append(
            $("<input>", {
                "class": "form-control",
                id: "trial-" + trialNumStr + "-" + key,
                name: key,
                type: "text",
                value: val
            })
        ));//parameter value for user to edit
        oneEditParam.appendTo($("#trial-" + trialNumStr + "-parameters"));
    });
}