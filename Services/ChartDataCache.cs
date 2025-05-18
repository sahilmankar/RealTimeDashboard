using System.Collections.Concurrent;

namespace RealTimeDashboard.Services
{
    // remove caching if performace is problem /or add redis caching
    public class ChartDataCache
    {
        private readonly ConcurrentDictionary<(string ChartType, string GroupId), object> _cache = new();

        public void Set(string chartType, string groupId, object data)
        {
            _cache[(chartType, groupId)] = data;
        }

        public object? Get(string chartType, string groupId)
        {
            _cache.TryGetValue((chartType, groupId), out var data);
            return data;
        }
    }
}
