var getResponse = null;
var tuneResponse = null;

function onGetClicked() {
    var getRequest = {
        streamId: $("#streamId").val(),
        engineId: $("#engineId").val(),
        startDate: $("#fromDatePicker").val(),
        endDate: $("#toDatePicker").val()
    };

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
            $("#detection_history_original").kendoStockChart(createChartParams("History Detection Result", results, intervalMinutes));

            //initialize tune part
            $("#parameters").empty();
            $("#btn_tuning").prop("disabled", false);
            $("#btn_save").prop("disabled", true);
            $("#save_success_text").empty();

            $.each(getResponse.Parameters, function (key, val) {
                var oneParam = $("<div/>", { "class": "form-group" });
                oneParam.append($("<label/>", {
                    "class": "col-xs-4",
                    "for": key,
                    text: key
                }));//display parameter name
                oneParam.append($("<div/>", { "class": "col-xs-8" }).append(
                    $("<input>", {
                        "class": "form-control",
                        id: key,
                        type: "text",
                        value: val
                    })
                ));//display parameter value
                oneParam.appendTo($("#parameters"));
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
        }
    });
}

function onTuneClicked() {
    var newParams = new Object();
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
            $("#tuning_result_original").kendoStockChart(createChartParams("Tuning Result", results, intervalMinutes));

            //enable save
            $("#btn_save").prop("disabled", false);
            $("#save_success_text").empty();
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
            $("#save_success_text").html('<font color="green">Parameters are saved successfully!</font>');
        }
    })
}

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
    if (jqxhr.statusText == "Bad Request") {
        var errorObject = jqxhr.responseJSON;
        var errorText = "ErrorCode = " + errorObject.ErrorCode + "\nErrorMessage = " + errorObject.ErrorMessage;
        $("#btn_save").prop("disabled", true);
    }
    else// Deal with other standard HttpStatusCode such as 500 for InternalServerError
    {
        var errorText = jqxhr.responseText == null ? "null" : jqxhr.responseText;
    }
    alert(jqxhr.statusText + "\n" + errorText);
});