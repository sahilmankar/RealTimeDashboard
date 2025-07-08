using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace RealTimeDashboard.Services
{
    public class ChartDataCache
    {
        private readonly IDistributedCache _cache;
        public ChartDataCache(IDistributedCache cache)
        {
            _cache = cache;
        }

        private static string GetKey(string chartType, string groupId) => $"chart:{chartType}:{groupId}";

        public async Task SetAsync(string chartType, string groupId, object data, TimeSpan? ttl = null)
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = ttl ?? TimeSpan.FromMinutes(2)
            };

            var serialized = JsonSerializer.Serialize(data,new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase});
            await _cache.SetStringAsync(GetKey(chartType, groupId), serialized, options);
        }

        public async Task<T?> GetAsync<T>(string chartType, string groupId)
        {
            var serialized = await _cache.GetStringAsync(GetKey(chartType, groupId));
            return serialized is null ? default : JsonSerializer.Deserialize<T>(serialized,new JsonSerializerOptions { PropertyNameCaseInsensitive=false});
        }
    }
}
