namespace Microsoft.CAP.Portal.Controllers
{
    using System.Configuration;
    using System.Web.Mvc;
    public class HomeController : Controller
    {
        private static readonly string ApiBaseAddress = ConfigurationManager.AppSettings[nameof(ApiBaseAddress)];
        private static readonly string TuningUriPath = ConfigurationManager.AppSettings[nameof(TuningUriPath)];
        public ActionResult Index()
        {
            ViewBag.TuningUrl = ApiBaseAddress + TuningUriPath;
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