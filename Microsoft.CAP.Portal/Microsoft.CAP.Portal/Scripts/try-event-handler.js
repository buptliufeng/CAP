function onPageLoaded() {
    //get anomaly engines
    $.ajax({
        url: engineUrl,
        type: "GET",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        success: function (engines) {
            for (var index in engines) {
                $("#engine-id").append($("<option/>", {
                    value: engines[index].EngineId,
                    text: engines[index].Description
                }))
            }
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