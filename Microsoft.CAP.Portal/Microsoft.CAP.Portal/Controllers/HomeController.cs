namespace Microsoft.CAP.Portal.Controllers
{
    using System.Configuration;
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
            ViewBag.GetEngineUrl = ApiBaseAddress + GetEngineUriPath;
            return View();
        }

        public ActionResult Try()
        {
            ViewBag.TryTuningUrl = ApiBaseAddress + TryTuningUriPath;
            ViewBag.GetEngineUrl = ApiBaseAddress + GetEngineUriPath;
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
    }
}