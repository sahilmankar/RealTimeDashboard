using Microsoft.AspNetCore.SignalR;
using RealTimeDashboard.Models;

namespace RealTimeDashboard.Services
{
    public interface IChartDataService
    {
        Task<object> GenerateChartDataAsync(string chartType, string groupId);
    }

    public class ChartDataService : IChartDataService
    {
        private readonly ChartDataCache _cache;

        public ChartDataService(ChartDataCache cache)
        {
            _cache = cache;
        }

        public Task<object> GenerateChartDataAsync(string chartType, string groupId)
        {
            switch (chartType)
            {
                case ChartTypes.Stock:
                    return GenerateStockData(groupId);
                case ChartTypes.Volume:
                    return GenerateVolumeData(groupId);
                case ChartTypes.Sentiment:
                    return GenerateVolumeData(groupId);
                default:
                    throw new ArgumentException($"Unknown chart type: {chartType}", nameof(chartType));

            }
        }

        public async Task<object> GenerateStockData(string groupId)
        {
            var data = new
            {
                Time = DateTime.UtcNow,
                Price = Random.Shared.Next(100, 200)
            };

            _cache.Set(ChartTypes.Stock, groupId, data);
            await Task.CompletedTask;
            return data;
        }

        public async Task<object> GenerateVolumeData(string groupId)
        {
            var data = new
            {
                Time = DateTime.UtcNow,
                Price = Random.Shared.Next(100, 200)
            };

            _cache.Set(ChartTypes.Volume, groupId, data);
            await Task.CompletedTask;
            return data;
        }
    }
}
