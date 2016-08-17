namespace Microsoft.CAP.Portal.Controllers
{
    using Model.Schema.API;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        private static readonly string ApiBaseAddress = ConfigurationManager.AppSettings[nameof(ApiBaseAddress)];
        private static readonly string TuningUriPath = ConfigurationManager.AppSettings[nameof(TuningUriPath)];
        private static readonly string TryTuningUriPath = ConfigurationManager.AppSettings[nameof(TryTuningUriPath)];
        private static readonly string GetEngineUriPath = ConfigurationManager.AppSettings[nameof(GetEngineUriPath)];

        public ActionResult Index()
        {
            ViewBag.TuningUrl = ApiBaseAddress + TuningUriPath;
            return View();
        }

        public async Task<ActionResult> Try()
        {
            ViewBag.TryTuningUrl = ApiBaseAddress + TryTuningUriPath;
            ViewBag.AnomalyEngines = await GetAnomalyEngines();
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public async Task<List<AnomalyEngineMetadata>> GetAnomalyEngines()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(ApiBaseAddress);
                var builder = new UriBuilder(ApiBaseAddress);
                builder.Path = GetEngineUriPath;
                string uri = builder.ToString();
                HttpResponseMessage responseMessage = await client.GetAsync(uri);
                if (responseMessage.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var jsonString = await responseMessage.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<List<AnomalyEngineMetadata>>(jsonString);
                }
                else
                {
                    return new List<AnomalyEngineMetadata>();
                }
            }
        } 
    }
}