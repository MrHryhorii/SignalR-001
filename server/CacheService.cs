using Microsoft.Extensions.Caching.Memory;
using System.Collections.Concurrent;

/// A sliding expiration cache wrapper with concurrency protection.
public class SlidingCache
{
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _defaultTtl;

    // Locks per key to avoid multiple concurrent fetches
    private readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

    public SlidingCache(IMemoryCache cache, TimeSpan defaultTtl)
    {
        _cache = cache;
        _defaultTtl = defaultTtl;
    }

    /// Returns the cached value for a given key.
    /// If not found, fetches the value using the provided async function, caches it, and returns it.
    /// Ensures only one fetch happens per key at a time.
    public async Task<T> GetOrFetchAsync<T>(string key, Func<Task<T>> fetcher, TimeSpan? ttl = null)
    {
        // Try to get value from cache
        if (_cache.TryGetValue(key, out var cached) && cached is T cachedValue)
        {
            return cachedValue;
        }

        var keyLock = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
        await keyLock.WaitAsync();

        try
        {
            // Double-check inside lock to prevent race condition
            if (_cache.TryGetValue(key, out cached) && cached is T existing)
            {
                return existing;
            }

            var result = await fetcher();

            _cache.Set(key, result, new MemoryCacheEntryOptions
            {
                SlidingExpiration = ttl ?? _defaultTtl
            });

            return result;
        }
        finally
        {
            keyLock.Release();
            _locks.TryRemove(key, out _); // Optional: remove lock to avoid growth
        }
    }
    // Check
    public bool Exists(string key)
    {
        return _cache.TryGetValue(key, out _);
    }
}
