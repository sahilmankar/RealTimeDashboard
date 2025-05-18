using System.Collections.Concurrent;

namespace RealTimeDashboard.Services
{
    public class UserGroupTracker
    {
        // groupId -> (connectionId -> dummy byte)
        private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _groupConnections = new();

        public void AddConnection(string groupId, string connectionId)
        {
            var connections = _groupConnections.GetOrAdd(groupId, _ => new ConcurrentDictionary<string, byte>());
            connections[connectionId] = 0; // dummy value
        }

        public void RemoveConnection(string groupId, string connectionId)
        {
            if (_groupConnections.TryGetValue(groupId, out var connections))
            {
                connections.TryRemove(connectionId, out _);

                if (connections.IsEmpty)
                {
                    _groupConnections.TryRemove(groupId, out _);
                }
            }
        }

        public IEnumerable<string> GetActiveGroups() => _groupConnections.Keys;

        public IEnumerable<string> GetConnections(string groupId)
        {
            if (_groupConnections.TryGetValue(groupId, out var connections))
            {
                return connections.Keys;
            }
            return Enumerable.Empty<string>();
        }
    }
}
