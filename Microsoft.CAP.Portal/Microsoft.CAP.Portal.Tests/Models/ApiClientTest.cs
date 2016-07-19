namespace Microsoft.CAP.Portal.Tests.Models
{
    using Model.Schema.API;
    using Newtonsoft.Json;
    using Portal.Models;
    using System;
    using System.Diagnostics;
    using System.Net.Http;
    using System.Threading.Tasks;
    using VisualStudio.TestTools.UnitTesting;

    [TestClass]
    public class ApiClientTest
    {
        [Ignore]
        [TestMethod]
        public async Task GetHistory()
        {
            string engineId = "any";
            DateTime date = DateTime.Parse("2016-5-29");
            try
            {
                HttpResponseMessage responseMessage = await ApiClient.GetDetectionHistory(StreamId, engineId, date, date);
                if (responseMessage.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var jsonString = await responseMessage.Content.ReadAsStringAsync();
                    TuningResponse tuningResponse = JsonConvert.DeserializeObject<TuningResponse>(jsonString);
                    LogTuningResponse(tuningResponse);
                }
                else
                {
                    await DealWithErrorResponse(responseMessage);
                }
            }
            catch (HttpRequestException ex)
            {
                Trace.TraceError("HTTP request failed with error: {0}", ex.Message);
                if (ex.InnerException != null)
                {
                    Trace.TraceError("InnerException: {0}", ex.InnerException.Message);
                }
            }
        }

        private const string StreamId = "test stream";

        private static void LogTuningResponse(TuningResponse tuningResponse)
        {
            Trace.TraceInformation("{0} = {1}", nameof(tuningResponse.StreamId), tuningResponse.StreamId);
            Trace.TraceInformation("{0} = {1}", nameof(tuningResponse.EngineId), tuningResponse.EngineId);
            Trace.TraceInformation("{0} = {1}", nameof(tuningResponse.DataType), tuningResponse.DataType.ToString());
            Trace.TraceInformation("{0} = {1}", nameof(tuningResponse.DataIntervalSeconds), tuningResponse.DataIntervalSeconds);
            Trace.TraceInformation("{0}: ", nameof(tuningResponse.Parameters));
            if (tuningResponse.Parameters != null)
            {
                foreach (var kv in tuningResponse.Parameters)
                {
                    Trace.TraceInformation("    {0} = {1}", kv.Key, kv.Value);
                }
            }

            if (tuningResponse.Results != null && tuningResponse.Results.Count > 0)
            {
                Trace.TraceInformation("Detection results have {0} rows", tuningResponse.Results.Count);
            }
            else
            {
                Trace.TraceInformation("Detection results is empty", nameof(tuningResponse.Results));
            }
        }

        private static async Task DealWithErrorResponse(HttpResponseMessage responseMessage)
        {
            if (responseMessage.StatusCode == System.Net.HttpStatusCode.BadRequest)
            {
                var jsonString = await responseMessage.Content.ReadAsStringAsync();
                CapError error = JsonConvert.DeserializeObject<CapError>(jsonString);
                Trace.TraceError("Bad request with ErrorCode = {0}, ErrorMessage = {1}",
                    error.ErrorCode, error.ErrorMessage);
            }
            else// Deal with other standard HttpStatusCode such as 500 for InternalServerError
            {
                Trace.TraceError("Other Error with StatusCode = {0}, content = {1}",
                    responseMessage.StatusCode,
                    responseMessage.Content == null ? "null" : responseMessage.Content.ToString());
            }
        }
    }
}
