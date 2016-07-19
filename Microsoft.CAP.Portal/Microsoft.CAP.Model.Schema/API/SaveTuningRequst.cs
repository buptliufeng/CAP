namespace Microsoft.CAP.Model.Schema.API
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class SaveTuningRequst
    {
        /// <summary>
        /// ID of the stream
        /// </summary>
        [Required]
        public string StreamId { get; set; }

        /// <summary>
        /// ID of the Anomaly Engine to be used
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
        /// Key-value pairs of detection parameters, or null if not any
        /// </summary>
        public Dictionary<string, string> Parameters { get; set; }
    }
}
