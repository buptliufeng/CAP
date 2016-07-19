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
        public string StreamId { get; set; }

        public string EngineId { get; set; }

        public string FromDate { get; set; }

        public string ToDate { get; set; }

        public IDictionary<string,string> Parameters { get; set; }

        public TuningViewModel()
        {
            Parameters = new Dictionary<string, string>();
        }
    }
}