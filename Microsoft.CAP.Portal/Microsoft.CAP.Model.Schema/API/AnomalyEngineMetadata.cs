namespace Microsoft.CAP.Model.Schema.API
{
    public class AnomalyEngineMetadata
    {
        /// <summary>
        /// The Engine Guid 
        /// </summary>
        public string EngineId { set; get; }

        /// <summary>
        /// The DataType supported Data Types. for example, Periodic, Linear, Threshold, HistoricalThreshold 
        /// </summary>
        public string DataType { set; get; }

        /// <summary>
        /// Type of the Anomaly Detection model supported by this engine.
        /// </summary>
        public string ADModelType { get; set; }

        /// <summary>
        /// The algorithm name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The algorithm description 
        /// </summary>
        public string Description { set; get; }
    }
}
