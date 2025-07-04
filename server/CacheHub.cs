using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using server.Models;


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
    private static readonly DataSource _dataSource = new();

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
    
    public class UpsertOptions
    {
        public int Ttl { get; set; } = 3600000;
        public bool ErrorOnExists { get; set; } = false;
    }

    public class SetOptions
    {
        public int Ttl { get; set; } = 3600000;
        public string? Schema { get; set; } = null; // Placeholder
        public bool Validate { get; set; } = true;
    }

    public class GetOptions
    {
        public int Timeout { get; set; } = 10000;
        public string? Callback { get; set; } = null; // Placeholder
    }

    public async Task<Response> Set(string key, string value, SetOptions? options)
    {
        int ttl = options?.Ttl ?? 3600000;

        if (_config.Strict && !IsPrimitiveOrJson(value))
            return Response.Fail("Strict mode is enabled: value must be primitive or valid JSON.");

        var existing = await _dataSource.FetchAsync(key);
        if (existing != null)
            return Response.Fail("Key already exists in data source.");

        await _dataSource.SaveAsync(key, value);
        await _cache.GetOrFetchAsync(key, () => Task.FromResult<object?>(value), TimeSpan.FromMilliseconds(ttl));

        Log(LogLevelEnum.INFO, $"[SET] Key '{key}' inserted.");
        return Response.Ok();
    }

    public async Task<Response> Get(string key, GetOptions? options)
    {
        var timeout = options?.Timeout ?? 10000;
        // get data from cache or storage
        var value = await _cache.GetOrFetchAsync<object?>(
            key,
            async () =>
            {
                var fetched = await _dataSource.FetchAsync(key);
                if (fetched == null)
                {
                    Log(LogLevelEnum.INFO, $"[GET] Key '{key}' not found in cache or data source.");
                }
                else
                {
                    Log(LogLevelEnum.INFO, $"[GET] Key '{key}' loaded from data source.");
                }
                return fetched;
            },
            TimeSpan.FromMinutes(timeout) // timeout
        );

        // no data
        if (value == null)
            return Response.Fail("Key not found");

        return Response.Ok(value);
    }

    public async Task<Response> Upsert(string key, string value, UpsertOptions? options)
    {
        var ttl = options?.Ttl ?? 3600000;
        var errorOnExists = options?.ErrorOnExists ?? false;

        if (_config.Strict && !IsPrimitiveOrJson(value))
            return Response.Fail("Strict mode is enabled: value must be primitive or valid JSON.");

        // check for it exists
        var exists = await _dataSource.ExistsAsync(key);
        if (errorOnExists && exists)
        {
            Log(LogLevelEnum.WARNING, $"[UPSERT] Key '{key}' already exists. errorOnExists=true -> rejecting.");
            return Response.Fail("Key already exists and 'errorOnExists' is true.");
        }

        // save to storage
        await _dataSource.SaveAsync(key, value);
        // update cache
        await _cache.GetOrFetchAsync(key, () => Task.FromResult<object?>(value), TimeSpan.FromMilliseconds(ttl));

        return Response.Ok();
    }

}
