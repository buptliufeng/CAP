namespace Microsoft.CAP.Portal.Models
{
    using Model.Schema.API;
    using System;
    using System.Configuration;
    using System.Diagnostics;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web;

    /// <summary>
    /// This is the client to call CAP APIs
    /// </summary>
    public static class ApiClient
    {
        private static readonly string ApiBaseAddress = ConfigurationManager.AppSettings[nameof(ApiBaseAddress)];
        private static readonly string TuningUriPath = ConfigurationManager.AppSettings[nameof(TuningUriPath)];
        private static readonly string GetEngineUriPath = ConfigurationManager.AppSettings[nameof(GetEngineUriPath)];

        public static async Task<HttpResponseMessage> GetDetectionHistory(string streamId, string engineId, DateTime startDate, DateTime endDate)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiBaseAddress);
                var builder = new UriBuilder(ApiBaseAddress);
                builder.Path = TuningUriPath;
                var query = HttpUtility.ParseQueryString(builder.Query);
                query[nameof(streamId)] = streamId;
                query[nameof(engineId)] = engineId;
                query[nameof(startDate)] = startDate.ToShortDateString();
                query[nameof(endDate)] = endDate.ToShortDateString();
                builder.Query = query.ToString();

                string uri = builder.ToString();
                Trace.TraceInformation("GET {0}", uri);

                HttpResponseMessage responseMessage = await client.GetAsync(uri);
                return responseMessage;
            }
        }

        public static async Task<HttpResponseMessage> Tune(TuningRequest request)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiBaseAddress);

                HttpResponseMessage responseMessage = await client.PostAsJsonAsync(TuningUriPath, request);
                return responseMessage;
            }
        }

        public static async Task<HttpResponseMessage> Save(SaveTuningRequst request)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiBaseAddress);

                HttpResponseMessage responseMessage = await client.PutAsJsonAsync(TuningUriPath, request);
                return responseMessage;
            }
        }

        public static async Task<HttpResponseMessage> GetAnomalyEngine()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiBaseAddress);
                var builder = new UriBuilder(ApiBaseAddress);
                builder.Path = GetEngineUriPath;
                string uri = builder.ToString();

                HttpResponseMessage responseMessage = await client.GetAsync(uri);
                return responseMessage;
            }
        }
    }
}