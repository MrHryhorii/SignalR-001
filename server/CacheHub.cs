using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;


namespace server;
public enum LogLevelEnum
{
    DEBUG, INFO, WARNING, ERROR
}

public class ServerConfig
{
    public bool Strict { get; set; } = false;
    public LogLevelEnum LogLevel { get; set; } = LogLevelEnum.INFO;
}

[Authorize]
public class CacheHub : Hub
{
    private static readonly ServerConfig _config = new();
    private static readonly IMemoryCache _memoryCache = new MemoryCache(new MemoryCacheOptions());
    private static readonly SlidingCache _cache = new(_memoryCache, TimeSpan.FromMinutes(10));

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

    private bool IsPrimitiveOrJson(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        try
        {
            var json = JsonDocument.Parse(value);
            return json.RootElement.ValueKind switch
            {
                JsonValueKind.String or
                JsonValueKind.Number or
                JsonValueKind.True or
                JsonValueKind.False or
                JsonValueKind.Object => true,
                _ => false
            };
        }
        catch
        {
            return false;
        }
    }
}
