using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Microsoft.CAP.Portal.Models
{
    public class TuningViewModel
    {
        public string StreamID { get; set; }

        public string EngineID { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public IDictionary<string,double> Parameters { get; set; }

        public TuningViewModel()
        {
            Parameters = new Dictionary<string, double>();
        }
    }
}