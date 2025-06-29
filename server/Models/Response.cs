namespace server.Models;

public class Response
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public object? Data { get; set; }
    public string RequestId { get; set; } = Guid.NewGuid().ToString();
    public ErrorDetail? Error { get; set; }

    public static Response Ok(object? data = null, string message = "OK", string? requestId = null) => new Response
    {
        Success = true,
        Message = message,
        Data = data,
        RequestId = requestId ?? Guid.NewGuid().ToString()
    };

    public static Response Fail(string message = "Something went wrong", int code = 400, string? requestId = null) => new Response
    {
        Success = false,
        Error = new ErrorDetail
        {
            Code = code,
            Details = message
        },
        RequestId = requestId ?? Guid.NewGuid().ToString()
    };
}

public class ErrorDetail
{
    public int Code { get; set; }
    public string? Details { get; set; }
}
