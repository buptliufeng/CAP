var getResponse = null;
var tuneResponse = null;
var dataTypeMapArray = ["Unknown", "Periodic"];

function onGetClicked() {
    var getRequest = {
        streamId: $("#stream-id").val(),
        engineId: $("#engine-id").val(),
        startDate: $("#from-datepicker").val(),
        endDate: $("#to-datepicker").val()
    };

    $("#detection-history-loader").show();
    $("#btn-get-history").prop("disabled", true);//avoid user's repetitive click

    $.ajax({
        url: tuningUrl,
        type: "GET",
        data: getRequest,
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            getResponse = data;

            var results = getResponse.Results;
            var intervalMinutes = getResponse.DataIntervalSeconds / 60;

            $("#detection-history-chart").kendoStockChart(createChartParams("Detection Result", results, intervalMinutes));

            //initialize tune part
            $("#btn-tune").prop("disabled", false);
            $("#btn-load").prop("disabled", false);
            $("#btn-save-local").prop("disabled", false);
            $("#btn-save-cap").prop("disabled", true);
            $("#save-success-text").empty();
            $("#tuning-result-chart").kendoStockChart(createChartParams("Tuning Result", null, null));

            showParamsInSystem(getResponse.Parameters);
            updateParamsForTuning(getResponse.Parameters);

            $("#engine-id").val(getResponse.EngineId);
            $("#tune-engine-id").parents(".form-group").show();
            $("#tune-engine-id").val(getResponse.EngineId);

            $("#data-type").val(dataTypeMapArray[getResponse.DataType]);
            $("#interval-seconds").val(getResponse.DataIntervalSeconds);
            $("#stream-info").show();
        },
        complete: function () {
            $("#detection-history-loader").hide();
            $("#btn-get-history").prop("disabled", false);
        }
    });
}

function onTuneClicked() {
    var newParams = new Object();
    $("#parameters-for-tuning").find("input").each(function () {
        if ($(this).val() != "") {
            newParams[this.id] = this.value;
        }
    });

    var tuneRequest = {
        StreamId: $("#stream-id").val(),
        EngineId: $("#tune-engine-id").val(),
        DataType: getResponse.DataType,
        DataIntervalSeconds: getResponse.DataIntervalSeconds,
        StartDate: $("#from-datepicker").val(),
        EndDate: $("#to-datepicker").val(),
        Parameters: newParams
    };

    $("#tuning-result-loader").show();
    $("#btn-tune").prop("disabled", true);//avoid user's repetitive click

    $.ajax({
        url: tuningUrl,
        type: "POST",
        data: JSON.stringify(tuneRequest),
        dataType: "json",
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            tuneResponse = data;
            var results = tuneResponse.Results;
            var intervalMinutes = tuneResponse.DataIntervalSeconds / 60;
            $("#tuning-result-chart").kendoStockChart(createChartParams("Tuning Result", results, intervalMinutes));

            updateParamsForTuning(tuneResponse.Parameters);

            //enable save
            $("#btn-save-cap").prop("disabled", false);
            $("#save-success-text").empty();
        },
        complete: function () {
            $("#tuning-result-loader").hide();
            $("#btn-tune").prop("disabled", false);
        }
    });

}

function onSaveToCapClicked() {
    var saveOk = confirm("The parameters will be saved to CAP system and affect future detection.\nAre you sure you want to save?");
    if (saveOk) {
        onSaveToCapConfirmed();
    }
}

function onSaveToCapConfirmed() {
    $("#tuning-result-loader").show();
    $("#btn-save-cap").prop("disabled", true);//avoid user's repetitive click

    var saveRequest = {
        StreamId: tuneResponse.StreamId,
        EngineId: tuneResponse.EngineId,
        DataType: tuneResponse.DataType,
        DataIntervalSeconds: tuneResponse.DataIntervalSeconds,
        Parameters: tuneResponse.Parameters
    };
    $.ajax({
        url: tuningUrl,
        type: "PUT",
        data: JSON.stringify(saveRequest),
        contentType: "application/json",
        xhrFields: {
            withCredentials: true
        },
        success: function () {
            $("#save-success-text").html('<font color="green">Parameters are saved successfully!</font>');
        },
        complete: function () {
            $("#tuning-result-loader").hide();
            $("#btn-save-cap").prop("disabled", false);
        }
    })
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

function updateParamsForTuning(params) {
    $("#parameters-for-tuning").empty();

    $.each(params, function (key, val) {
        var oneEditParam = $("<div/>", { "class": "form-group" });
        oneEditParam.append($("<div/>", { "class": "col-xs-5" }).append(
            $("<label/>", {
                "class": "control-label",
                "for": key,
                text: key + ":"
            })
        ));
        oneEditParam.append($("<div/>", { "class": "col-xs-7" }).append(
            $("<input>", {
                "class": "form-control",
                id: key,
                type: "text",
                value: val
            })
        ));//parameter value for user to edit
        oneEditParam.appendTo($("#parameters-for-tuning"));
    });
}

function showParamsInSystem(params) {
    $("#parameters-in-system").empty();

    $.each(params, function (key, val) {
        var oneDisplayParam = $("<div/>", { "class": "form-group" });
        oneDisplayParam.append($("<div/>", { "class": "col-xs-5" }).append(
            $("<label/>", {
                "class": "control-label",
                text: key + ":"
            })
        ));//display parameter name
        oneDisplayParam.append($("<div/>", { "class": "col-xs-7" }).append(
            $("<input>", {
                "class": "form-control",
                type: "text",
                value: val,
                readonly: "readonly"
            })
        ));//display parameter value
        oneDisplayParam.appendTo($("#parameters-in-system"));
    });
}

function onJsonSelected(event) {
    var selectedFile = event.target.files[0];
    if (selectedFile) {
        var reader = new FileReader();
        reader.readAsText(selectedFile);
        reader.onload = function (readerEvent) {
            try {
                //load saved config
                var localConfig = JSON.parse(readerEvent.target.result);
                $("#data-type").val(dataTypeMapArray[localConfig.DataType]);
                $("#interval-seconds").val(localConfig.DataIntervalSeconds);
                $("#tune-engine-id").val(localConfig.EngineId);
                updateParamsForTuning(localConfig.Parameters);
            }
            catch (e) {
                alert("Invalid json format\n" + e.message);
            }

            $("#input-load").val("");//enable reloading file
        };
    }
}

function onSaveToLocalClicked() {
    var historyParams = new Object();
    $("#parameters-for-tuning").find("input").each(function () {
        historyParams[this.id] = this.value;
    })
    var config = {
        DataType: dataTypeMapArray.indexOf($("#data-type").val()),//inverse operation of dataTypeMap
        DataIntervalSeconds: $("#interval-seconds").val(),
        EngineId: $("#tune-engine-id").val(),
        Parameters: historyParams
    };

    //save config locally
    var configBlob = new Blob([JSON.stringify(config)], { type: "application/json" });
    var defaultName = $("#stream-id").val() + ".json";
    window.navigator.msSaveBlob(configBlob, defaultName);
}