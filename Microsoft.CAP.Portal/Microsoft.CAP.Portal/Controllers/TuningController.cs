namespace Microsoft.CAP.Portal.Controllers
{
    using Model.Schema.API;
    using Models;
    using Newtonsoft.Json;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public class TuningController : Controller
    {
        private static readonly string ApiBaseAddress = ConfigurationManager.AppSettings[nameof(ApiBaseAddress)];
        private static readonly string TuningUriPath = ConfigurationManager.AppSettings[nameof(TuningUriPath)];

        public async Task<ActionResult> Index()
        {
            ViewBag.TuningUrl = ApiBaseAddress + TuningUriPath;
            HttpResponseMessage responseMessage = await ApiClient.GetAnomalyEngine();
            if (responseMessage.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var jsonString = await responseMessage.Content.ReadAsStringAsync();
                ViewBag.AnomalyEngines=JsonConvert.DeserializeObject<List<AnomalyEngineMetadata>>(jsonString);
            }
            else
            {
                ViewBag.AnomalyEngines = new List<AnomalyEngineMetadata>();
            }
            return View();
        }
    }
}