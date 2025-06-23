var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR(); // Adds SignalR to the app's service container

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<CacheHub>("/hub/cache"); // Maps the CacheHub to the route "/hub/cache"

app.Run("http://localhost:5000");   // Starts the server and listens only on HTTP at port 5000 (disables HTTPS) http://localhost:5000/hub/cache
