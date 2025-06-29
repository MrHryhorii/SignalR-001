namespace server.Models;

public class Response
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public object? Data { get; set; }
    public string RequestId { get; set; } = Guid.NewGuid().ToString();

    public static Response Ok(object? data = null, string message = "OK", string? requestId = null) => new Response
    {
        Success = true,
        Message = message,
        Data = data,
        RequestId = requestId ?? Guid.NewGuid().ToString()
    };

    public static Response Fail(string message = "Something went wrong", string? requestId = null) => new Response
    {
        Success = false,
        Message = message,
        RequestId = requestId ?? Guid.NewGuid().ToString()
    };
}
