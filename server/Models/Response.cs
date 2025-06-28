namespace server.Models;

public class Response
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public object? Data { get; set; }

    public static Response Ok(object? data = null, string message = "OK") => new Response
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static Response Fail(string message = "Something went wrong") => new Response
    {
        Success = false,
        Message = message
    };
}
