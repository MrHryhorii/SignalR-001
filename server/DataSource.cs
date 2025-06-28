namespace server;

public class DataSource
{
    private readonly Dictionary<string, object> _data = new()
    {
        ["user:1"] = new { Name = "Alice", Age = 30 },
        ["user:2"] = new { Name = "Bob", Age = 25 }
    };

    public Task<object?> FetchAsync(string key)
    {
        _data.TryGetValue(key, out var value);
        return Task.FromResult(value);
    }

     public Task SaveAsync(string key, object value)
    {
        _data[key] = value;
        return Task.CompletedTask;
    }
}
