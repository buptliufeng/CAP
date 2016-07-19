namespace Microsoft.CAP.Model.Schema.API
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class TuningRequest
    {
        /// <summary>
        /// ID of the stream
        /// </summary>
        [Required]
        public string StreamId { get; set; }

        /// <summary>
        /// ID of the Anomaly Engine to be used. You can tune by switching to another CAP Engine,
        /// as long as this Stream is being detected by CAP by any engine so CAP has enough history data
        /// </summary>
        [Required]
        public string EngineId { get; set; }

        /// <summary>
        /// Must be a known DataType, can not be Unknown
        /// </summary>
        [Required]
        public Schema.DataType DataType { get; set; }

        /// <summary>
        /// The interval between data points
        /// </summary>
        [Required]
        public double DataIntervalSeconds { get; set; }

        /// <summary>
        /// Start Date to detect.
        /// In the same time zone with stream data timestamps.
        /// </summary>
        [Required]
        public DateTime StartDate { get; set; }

        /// <summary>
        /// End Date to detect.
        /// In the same time zone with stream data timestamps.<br/>
        /// Inclusive. For example, "2016-07-06" includes data until 2016-07-06 23:59.
        /// </summary>
        [Required]
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Key-value pairs of detection parameters, or null if not any
        /// </summary>
        public Dictionary<string, string> Parameters { get; set; }
    }
}
