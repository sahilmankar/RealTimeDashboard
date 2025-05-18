using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using RealTimeDashboard.Hubs;
using RealTimeDashboard.Models;
using RealTimeDashboard.Services;

namespace RealTimeDashboard.BackgroundJobs
{
    public class StockPriceChartService : BackgroundService
    {
        private readonly IHubContext<ChartHub, IChartClient> _hubContext;
        private readonly UserGroupTracker _groupTracker;
        private readonly TimeSpan _interval;
        private readonly IServiceScopeFactory _scopeFactory;

        public StockPriceChartService(
            IHubContext<ChartHub, IChartClient> hubContext,
            IServiceScopeFactory scopeFactory,
            UserGroupTracker groupTracker,
            IOptions<ChartUpdateSettings> options)
        {
            _hubContext = hubContext;
            _scopeFactory = scopeFactory;
            _groupTracker = groupTracker;
            _interval = TimeSpan.FromSeconds(options.Value.StockPriceChartIntervalSeconds);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = _scopeFactory.CreateScope();
                var chartService = scope.ServiceProvider.GetRequiredService<IChartDataService>();

                var groups = _groupTracker.GetActiveGroups();
                foreach (var groupId in groups)
                {
                    if (!_groupTracker.GetConnections(groupId).Any())
                        continue;
                    var data = await chartService.GenerateChartDataAsync(ChartTypes.Stock, groupId);

                    await _hubContext.Clients.Group(groupId).ReceiveChartData(ChartTypes.Stock, data);
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }

}
