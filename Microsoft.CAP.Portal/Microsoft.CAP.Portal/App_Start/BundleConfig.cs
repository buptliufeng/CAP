﻿using System.Web;
using System.Web.Optimization;

namespace Microsoft.CAP.Portal
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            //add kendoUI css and js
            bundles.Add(new StyleBundle("~/Content/kendo-css").Include(
                      "~/Content/styles/kendo.common.min.css",
                      "~/Content/styles/kendo.default.min.css"
                      ));
            bundles.Add(new ScriptBundle("~/Scripts/kendo-js").Include(
                    "~/Scripts/kendo/kendo.all.min.js"));

            //add jquery-ui js for date picker
            bundles.Add(new ScriptBundle("~/Scripts/jquery-ui-js").Include(
                    "~/Scripts/jquery-ui-{version}.js"));
        }
    }

}
