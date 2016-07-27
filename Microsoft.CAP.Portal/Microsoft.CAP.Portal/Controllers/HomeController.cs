namespace Microsoft.CAP.Portal.Controllers
{
    using Model.Schema.API;
    using Models;
    using Newtonsoft.Json;
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    public class HomeController : Controller
    {
        /*public ActionResult Index()
        {
            return View();
        }*/
        public async Task<ActionResult> Index()
        {
            string streamId = "test stream";
            string engineId = "any";
            DateTime startDate = DateTime.Parse("2016-5-29");
            DateTime endDate = DateTime.Parse("2016-6-3");
            try
            {
                HttpResponseMessage responseMessage = await ApiClient.GetDetectionHistory(streamId, engineId, startDate, endDate);
                if (responseMessage.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var jsonString = await responseMessage.Content.ReadAsStringAsync();
                    TuningResponse tuningResponse = JsonConvert.DeserializeObject<TuningResponse>(jsonString);
                    return View(tuningResponse);
                }
                else
                {
                    return View();//to do: deal with error
                }
            }
            catch (HttpRequestException ex)
            {
                return View();//to do: deal with error
            }
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
    }
}