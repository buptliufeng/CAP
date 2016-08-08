var getResponse = null;
var tuneResponse = null;

function onGetClicked() {
    var getRequest = {
        streamId: $("#streamId").val(),
        engineId: $("#engineId").val(),
        startDate: $("#fromDatePicker").val(),
        endDate: $("#toDatePicker").val()
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
            $("#parameters-in-system").empty();
            $("#parameters-for-tuning").empty();
            $("#btn-tune").prop("disabled", false);
            $("#btn-save").prop("disabled", true);
            $("#save-success-text").empty();
            $("#tuning-result-chart").kendoStockChart(createChartParams("Tuning Result", null, null));

            $.each(getResponse.Parameters, function (key, val) {
                var oneDisplayParam = $("<div/>", { "class": "form-group" });
                oneDisplayParam.append($("<label/>", {
                    "class": "col-xs-4",
                    text: key
                }));//display parameter name
                oneDisplayParam.append($("<div/>", { "class": "col-xs-8" }).append(
                    $("<input>", {
                        "class": "form-control",
                        type: "text",
                        value: val,
                        readonly: "readonly"
                    })
                ));//display parameter value
                oneDisplayParam.appendTo($("#parameters-in-system"));

                var oneEditParam = $("<div/>", { "class": "form-group" });
                oneEditParam.append($("<label/>", {
                    "class": "col-xs-4",
                    "for": key,
                    text: key
                }));
                oneEditParam.append($("<div/>", { "class": "col-xs-8" }).append(
                    $("<input>", {
                        "class": "form-control",
                        id: key,
                        type: "text",
                        value: val
                    })
                ));//parameter value for user to edit
                oneEditParam.appendTo($("#parameters-for-tuning"));
            })

            //update the engineId select list
            if ($("#engineId option[value=" + getResponse.EngineId + "]").length == 0) {
                //not in the list
                $("#engineId").append($("<option/>", {
                    value: getResponse.EngineId,
                    text: getResponse.EngineId
                }));
            }
            $("#engineId").val(getResponse.EngineId);

        },
        complete: function () {
            $("#detection-history-loader").hide();
            $("#btn-get-history").prop("disabled", false);
        }
    });
}

function onTuneClicked() {
    var newParams = getResponse.Parameters == null ? null : new Object();
    for (var key in getResponse.Parameters) {
        //get parameter value entered by user 
        newParams[key] = $("#" + key).val();
    }
    var tuneRequest = {
        StreamId: $("#streamId").val(),
        EngineId: $("#engineId").val(),
        DataType: getResponse.DataType,
        DataIntervalSeconds: getResponse.DataIntervalSeconds,
        StartDate: $("#fromDatePicker").val(),
        EndDate: $("#toDatePicker").val(),
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

            //enable save
            $("#btn-save").prop("disabled", false);
            $("#save-success-text").empty();
        },
        complete: function () {
            $("#tuning-result-loader").hide();
            $("#btn-tune").prop("disabled", false);
        }
    });

}

function onSaveClicked() {
    var saveOk = confirm("The parameters will be saved to CAP system and affect future detection.\nAre you sure you want to save?");
    if (saveOk) {
        onSaveConfirmed();
    }
}

function onSaveConfirmed() {
    $("#tuning-result-loader").show();
    $("#btn-save").prop("disabled", true);//avoid user's repetitive click

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
            $("#btn-save").prop("disabled", false);
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