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
    using System.Web.Script.Serialization;

    public class TrialController : Controller
    {
        private static readonly string ApiBaseAddress = ConfigurationManager.AppSettings[nameof(ApiBaseAddress)];
        private static readonly string TryTuningUriPath = ConfigurationManager.AppSettings[nameof(TryTuningUriPath)];

        public async Task<ActionResult> Index()
        {
            ViewBag.TryTuningUrl = ApiBaseAddress + TryTuningUriPath;
            HttpResponseMessage responseMessage = await ApiClient.GetAnomalyEngine();
            if (responseMessage.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var jsonString = await responseMessage.Content.ReadAsStringAsync();
                ViewBag.AnomalyEngines = JsonConvert.DeserializeObject<List<AnomalyEngineMetadata>>(jsonString);
            }
            else
            {
                ViewBag.AnomalyEngines = new List<AnomalyEngineMetadata>();
                var loadEngineError= new ApiError
                {
                    StatusCode = responseMessage.StatusCode.ToString(),
                    ErrorMessage = await responseMessage.Content.ReadAsStringAsync()
                };
                var javascriptSerializer=new JavaScriptSerializer();
                ViewBag.LoadEngineError = javascriptSerializer.Serialize(loadEngineError);
            }
            return View();
        }
    }
}