using System.Collections.Concurrent;

namespace RealTimeDashboard.Services
{
    /// <summary>
    /// Tracks user group connections to avoid generating data for inactive groups.
    /// </summary>
    public class UserGroupTracker
    {
        // groupId -> (connectionId -> dummy byte)
        private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _groupConnections = new();

        // connectionId -> groupId
        private readonly ConcurrentDictionary<string, string> _connectionToGroup = new();

        public void AddConnection(string groupId, string connectionId)
        {
            var connections = _groupConnections.GetOrAdd(groupId, _ => new ConcurrentDictionary<string, byte>());
            connections[connectionId] = 0; // dummy value

            _connectionToGroup[connectionId] = groupId;
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

            _connectionToGroup.TryRemove(connectionId, out _);
        }

        /// <summary>
        /// Removes a connection and returns its group if found.
        /// </summary>
        public bool TryRemoveConnection(string connectionId, out string? groupId)
        {
            if (_connectionToGroup.TryRemove(connectionId, out groupId))
            {
                if (_groupConnections.TryGetValue(groupId, out var connections))
                {
                    connections.TryRemove(connectionId, out _);

                    if (connections.IsEmpty)
                    {
                        _groupConnections.TryRemove(groupId, out _);
                    }
                }
                return true;
            }

            groupId = null;
            return false;
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

        public string? FindGroupForConnection(string connectionId)
        {
            _connectionToGroup.TryGetValue(connectionId, out var groupId);
            return groupId;
        }
    }
}
