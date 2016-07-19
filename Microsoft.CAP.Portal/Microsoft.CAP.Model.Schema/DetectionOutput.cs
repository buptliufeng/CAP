namespace Microsoft.CAP.Model.Schema
{
    public class DetectionOutput
    {
        public System.DateTime Timestamp { get; set; }

        public double Value { get; set; }

        public bool IsAnomaly { get; set; }

        public double ExpectedValue { get; set; }

        public double LowerBound { get; set; }

        public double UpperBound { get; set; }

        public double ConfidenceIndex { get; set; }
    }
}
