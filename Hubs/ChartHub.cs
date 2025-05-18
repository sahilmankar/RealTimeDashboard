using Microsoft.AspNetCore.SignalR;
using RealTimeDashboard.Models;
using RealTimeDashboard.Services;

namespace RealTimeDashboard.Hubs
{

    public interface IChartClient
    {
        Task ReceiveChartData(string chartType, object data);
    }
    public class ChartHub : Hub<IChartClient>
    {
        private readonly ChartDataCache _cache;
        private readonly UserGroupTracker _groupTracker;
        private readonly IServiceScopeFactory _scopeFactory;
        public ChartHub(ChartDataCache cache, UserGroupTracker groupTracker, IServiceScopeFactory scopeFactory)
        {
            _cache = cache;
            _groupTracker = groupTracker;
            _scopeFactory = scopeFactory;
        }

        public override async Task OnConnectedAsync()
        {
            var http = Context.GetHttpContext();
            var groupId = http?.Request.Query["groupId"].ToString();

            if (!string.IsNullOrEmpty(groupId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
                _groupTracker.AddConnection(groupId, Context.ConnectionId);

                using var scope = _scopeFactory.CreateScope();
                var chartService = scope.ServiceProvider.GetRequiredService<IChartDataService>();

                foreach (var chartType in ChartTypes.All)
                {
                    var existingData = _cache.Get(chartType, groupId);

                    if (existingData is null)
                    {

                        existingData = await chartService.GenerateChartDataAsync(chartType, groupId);
                    }

                    await Clients.Caller.ReceiveChartData(chartType, existingData);

                }
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var groupId = Context.GetHttpContext()?.Request.Query["groupId"].ToString();

            if (!string.IsNullOrEmpty(groupId))
            {
                _groupTracker.RemoveConnection(groupId, Context.ConnectionId);
            }

            await base.OnDisconnectedAsync(exception);
        }

    }
}