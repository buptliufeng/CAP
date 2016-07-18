using Microsoft.CAP.Portal.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Microsoft.CAP.Portal.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            TuningViewModel testModel = new TuningViewModel()
            {
                /*StreamID = "123456",
                EngineID = "Any",*/
                FromDate = DateTime.Now.AddDays(-7).ToString("MM/dd/yyyy"),
                ToDate = DateTime.Now.ToString("MM/dd/yyyy"),
                Parameters = new Dictionary<string, double>()
                {
                    { "ParamA", 1.5 },
                    { "ParamB", 2.0 },
                    { "ParamC", 3 },
                    { "Period", 7 }
                }
            };
            return View(testModel);
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