﻿using Microsoft.CAP.Portal.Models;
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