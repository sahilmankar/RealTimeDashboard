using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using RealTimeDashboard.Hubs;
using RealTimeDashboard.Models;
using RealTimeDashboard.Services;

namespace RealTimeDashboard.BackgroundJobs
{
    public class BarChartBackgroundService : BackgroundService
    {
        private readonly IHubContext<ChartHub, IChartClient> _hubContext;
        private readonly UserGroupTracker _groupTracker;
        private readonly TimeSpan _interval;
        private readonly IServiceScopeFactory _scopeFactory;

        public BarChartBackgroundService(
            IHubContext<ChartHub, IChartClient> hubContext,
            IServiceScopeFactory scopeFactory,
            UserGroupTracker groupTracker,
            IOptions<ChartUpdateSettings> options)
        {
            _hubContext = hubContext;
            _scopeFactory = scopeFactory;
            _groupTracker = groupTracker;
            _interval = TimeSpan.FromSeconds(options.Value.BarChartIntervalSeconds);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var groups = _groupTracker.GetActiveGroups();
                if (groups.Count() > 0)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var chartService = scope.ServiceProvider.GetRequiredService<IChartDataService>();
                    foreach (var groupId in groups)
                    {
                        var data = await chartService.GenerateBarChartData(groupId);

                        await _hubContext.Clients.Group(groupId).ReceiveBarChartData(data);
                    }
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }

}
