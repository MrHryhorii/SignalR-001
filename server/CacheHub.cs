using Microsoft.AspNetCore.SignalR;

public class CacheHub : Hub
{
    public async Task SendSet(string key, string value)
    {
        Console.WriteLine($"Set {key} = {value}");
        await Clients.All.SendAsync("OnSet", key, value);
    }
}
