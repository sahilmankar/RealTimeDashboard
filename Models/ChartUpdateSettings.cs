namespace RealTimeDashboard.Models
{
    public class ChartUpdateSettings
    {
        public int StockPriceChartIntervalSeconds { get; set; }
        public int VolumeChartIntervalSeconds { get; set; }
        public int MarketSentimentChartIntervalSeconds { get; set; }
    }
}