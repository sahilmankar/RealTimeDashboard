namespace RealTimeDashboard.Models
{
    public static class ChartTypes
    {
        public const string Stock = "Stock";
        public const string Volume = "Volume";
        public const string Sentiment = "Sentiment";

        public static readonly string[] All = { Stock, Volume, Sentiment };
    }

}
