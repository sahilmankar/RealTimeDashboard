using Microsoft.AspNetCore.SignalR;
using RealTimeDashboard.Models;
using RealTimeDashboard.Services;
using System.Text.RegularExpressions;

namespace RealTimeDashboard.Hubs
{

    public interface IChartClient
    {
        Task ReceivePieChartData(object data);
        Task ReceiveBarChartData(object data);
        Task ReceiveSalesChartData(object data);


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
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {

            if (_groupTracker.TryRemoveConnection(Context.ConnectionId, out var groupId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestChartData(string chartType, string groupId)
        {
            if (string.IsNullOrWhiteSpace(groupId))
                return;


            var existingData = await _cache.GetAsync<object>(chartType, groupId);

            if (existingData is null)
            {
                using var scope = _scopeFactory.CreateScope();
                var chartService = scope.ServiceProvider.GetRequiredService<IChartDataService>();

                existingData = await chartService.GenerateChartDataAsync(chartType, groupId);
            }

            switch (chartType)
            {
                case ChartTypes.Bar:
                    await Clients.Caller.ReceiveBarChartData(existingData); break;
                case ChartTypes.Pie:
                    await Clients.Caller.ReceivePieChartData(existingData);
                    break;
                case ChartTypes.SalesChart:
                    await Clients.Caller.ReceiveSalesChartData(existingData);
                    break;
                default: break;
            }

        }

    }
}