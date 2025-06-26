using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using System.Threading.Tasks;

public enum LogLevelEnum
{
    DEBUG, INFO, WARNING, ERROR
}

public class ServerConfig
{
    public bool Strict { get; set; } = false;
    public LogLevelEnum LogLevel { get; set; } = LogLevelEnum.INFO;
}

public class CacheHub : Hub
{
    private static readonly ServerConfig _config = new ServerConfig();
    public async Task SendSet(string key, string value)
    {
        Console.WriteLine($"Set {key} = {value}");
        await Clients.All.SendAsync("OnSet", key, value);
    }

    public override async Task OnConnectedAsync()
    {
        Log(LogLevelEnum.INFO, $"Client connected: {Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public Task Config(ServerConfig config)
    {
        _config.Strict = config.Strict;
        _config.LogLevel = config.LogLevel;
        Log(LogLevelEnum.INFO, $"Configuration updated: Strict={config.Strict}, LogLevel={config.LogLevel}");
        return Task.CompletedTask;
    }

    private void Log(LogLevelEnum level, string message)
    {
        if ((int)level >= (int)_config.LogLevel)
        {
            Console.WriteLine($"[{level}] {message}");
        }
    }
}
