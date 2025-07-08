using Microsoft.AspNetCore.SignalR;
using RealTimeDashboard.Models;
using System;
using System.Text.RegularExpressions;

namespace RealTimeDashboard.Services
{
    public interface IChartDataService
    {
        Task<object> GenerateChartDataAsync(string chartType, string groupId);
        Task<object> GenerateBarChartData(string groupId);
        Task<object> GeneratePieChartData(string groupId);

        Task<List<SalesData>> GenerateSalesData(string groupId);
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
                case ChartTypes.Bar:
                    return GenerateBarChartData(groupId);
                case ChartTypes.Pie:
                    return GeneratePieChartData(groupId);
                case ChartTypes.Line:
                    return GeneratePieChartData(groupId);
                case ChartTypes.SalesChart:
                    return Task.FromResult((object)GenerateSalesData(groupId));
                default:
                    throw new ArgumentException($"Unknown chart type: {chartType}", nameof(chartType));

            }
        }

        public async Task<object> GenerateBarChartData(string groupId)
        {
            var data = Enumerable.Range(0, 5)
              .Select(i => new
              {
                  Time = DateTime.UtcNow.AddMinutes(-i),
                  Price = Random.Shared.Next(100, 200)
              })
              .ToList();

            await _cache.SetAsync(ChartTypes.Bar, groupId, data);
            return data;
        }

        public async Task<object> GeneratePieChartData(string groupId)
        {
            var categories = new[] { "Category A", "Category B", "Category C", "Category D", "Category E" };

            var data = categories
                .Select(category => new
                {
                    Label = category,
                    Value = Random.Shared.Next(10, 100)
                })
                .ToList();

            await _cache.SetAsync(ChartTypes.Pie, groupId, data);
            return data;
        }


        public async Task<List<SalesData>> GenerateSalesData(string groupId)
        {
           

            var salesData = new List<SalesData>();

            string[] years = { "2023", "2024", "2025", "2026" };
            string[] quarters = { "Q1", "Q2", "Q3", "Q4" };
            string[] regions = { "North", "South", "East", "West" };
            string[] products = { "A", "B", "C", "D" };

            var random = new Random();

            foreach (var year in years)
            {
                foreach (var quarter in quarters)
                {
                    foreach (var region in regions)
                    {
                        foreach (var product in products)
                        {
                            salesData.Add(new SalesData
                            {
                                Year = year,
                                Quarter = quarter,
                                Region = region,
                                ProductName = product,
                                Amount = random.Next(2000, 10000) // Random amount between 2000–9999
                            });
                        }
                    }
                }
            }

            await _cache.SetAsync(ChartTypes.SalesChart, groupId, salesData);
            return salesData;

        }
    }
}
