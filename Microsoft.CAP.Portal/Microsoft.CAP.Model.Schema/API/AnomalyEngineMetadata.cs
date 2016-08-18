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
        /// IsStateless, AzureML = true
        /// </summary>
        public bool IsStateless { set; get; }

        /// <summary>
        /// The algorithm description 
        /// </summary>
        public string Description { set; get; }
    }
}
