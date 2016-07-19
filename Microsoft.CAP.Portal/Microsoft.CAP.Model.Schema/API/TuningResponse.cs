namespace Microsoft.CAP.Model.Schema.API
{
    using System.Collections.Generic;

    public class TuningResponse
    {
        /// <summary>
        /// ID of the stream
        /// </summary>
        public string StreamId { get; set; }

        /// <summary>
        /// ID of the Anomaly Engine
        /// </summary>
        public string EngineId { get; set; }

        public DataType DataType { get; set; }

        /// <summary>
        /// The interval between data points
        /// </summary>
        public double DataIntervalSeconds { get; set; }

        /// <summary>
        /// Key-value pairs of tunable parameters, or null if this engine is not tunable.
        /// </summary>
        public Dictionary<string, string> Parameters { get; set; }

        /// <summary>
        /// The detection results, or null if no result is found.
        /// </summary>
        public List<DetectionOutput> Results { get; set; }
    }
}