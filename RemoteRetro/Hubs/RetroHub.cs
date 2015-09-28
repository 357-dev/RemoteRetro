using Microsoft.AspNet.SignalR;

namespace RemoteRetro.Hubs
{
    public class RetroHub : Hub
    {
        /*
        public async Task JoinRoom(string teamName, string memberName)
        {
            await Groups.Add(Context.ConnectionId, teamName);
            
            Clients.Group(teamName).memberJoined(memberName);
        }

        public Task LeaveRoom(string teamName)
        {
            return Groups.Remove(Context.ConnectionId, teamName);
        }

        public void AddPostIt(string teamName, string memberName, string type, string comment)
        {
            Clients.Group(teamName).addPostIt(Guid.NewGuid().ToString(), type, comment, memberName);
        }

        public void RemovePostIt(string teamName, string hash)
        {
            Clients.Group(teamName).removePostIt(hash);
        }

        public void VoteUp(string teamName, string hash)
        {
            Clients.Group(teamName).voteUp(hash);
        }

        public void VoteDown(string teamName, string hash)
        {
            Clients.Group(teamName).voteDown(hash);
        }*/
    }
}