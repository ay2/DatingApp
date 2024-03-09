using Newtonsoft.Json.Converters;

namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> _onlineUsers = 
            new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;

            lock(_onlineUsers)   // because Dictionary is not thread-safe!
            {
                if (_onlineUsers.TryGetValue(username, out List<string> connections))
                {
                    connections.Add(connectionId);
                }
                else
                {
                    _onlineUsers.Add(username, [connectionId]);
                    isOnline = true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;

            lock(_onlineUsers)   // because Dictionary is not thread-safe!
            {
                if (!_onlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);
                
                _onlineUsers[username].Remove(connectionId);

                if (_onlineUsers[username].Count == 0)
                {
                    _onlineUsers.Remove(username);
                    isOffline = true;
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;

            lock(_onlineUsers)
            {
                onlineUsers = _onlineUsers.OrderBy(u => u.Key).Select(u => u.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }

        public static Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> connectionIds;

            lock (_onlineUsers) // this may cause deadlock
            {
                connectionIds = _onlineUsers.GetValueOrDefault(username);
            }
            
            return Task.FromResult(connectionIds);
        }
    }
}