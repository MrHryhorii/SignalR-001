# 🔁 SignalR Real-time Key-Value Cache (Minimal Setup)

This project includes:
- A C# SignalR server (`server/`)
- A TypeScript test client (`client-lib/`)

---

## 🧠 Goal

Create a basic real-time key-value communication system using:
- SignalR in ASP.NET Core
- A TypeScript-based client for testing

---

## 📂 Folder Structure

```
project-root/
├── server/         # ASP.NET Core SignalR server
└── client-lib/     # TypeScript client
```

---

## 🪜 Step 1: Server Setup (`server/`)

### 1. Create and initialize server

```bash
dotnet new webapi -n server
cd server
dotnet add package Microsoft.AspNetCore.SignalR
```

### 2. Edit `Program.cs`

Add the following:

```csharp
builder.Services.AddSignalR();
app.MapHub<CacheHub>("/hub/cache");
app.Run("http://localhost:5000"); // Optional: run HTTP only
```

### 3. Create `CacheHub.cs` in `server/` folder

```csharp
using Microsoft.AspNetCore.SignalR;

public class CacheHub : Hub
{
    public async Task SendSet(string key, object value)
    {
        Console.WriteLine($"Set {key} = {value}");
        await Clients.Caller.SendAsync("OnSet", key, value);
    }
}
```

### 4. Run the server

```bash
dotnet run
```

> Server will be available at `http://localhost:5000/hub/cache`

---

## 🪜 Step 2: Client Setup (`client-lib/`)

### 1. Initialize Node project

```bash
mkdir client-lib
cd client-lib
npm init -y
npm install typescript @microsoft/signalr joi
npx tsc --init
```

### 2. Configure `tsconfig.json`

Just add this line at the bottom of the JSON:

```json
"include": ["src"]
```

> ⚠️ Make sure to add a comma if placing after `compilerOptions`

### 3. Create client source folder

```bash
mkdir src
```

### 4. Create `src/test-client.ts`

```ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hub/cache")
  .configureLogging(signalR.LogLevel.Information)
  .build();

connection.on("OnSet", (key, value) => {
  console.log("📥 Received from hub:", key, value);
});

async function start() {
  try {
    await connection.start();
    console.log("Connected to SignalR hub");

    await connection.invoke("SendSet", "testKey", "testValue");
    console.log("Sent test set to hub");
  } catch (err) {
    console.error("Connection error:", err);
  }
}

start();
```

---

## ▶️ Run the Project

### 1. Start the server

```bash
cd server
dotnet run
```

> Make sure it says: `Now listening on: http://localhost:5000`

### 2. Compile and run the client

```bash
cd ../client-lib
npx tsc
node src/test-client.js
```

✅ Expected Output:
```
✅ Connected to SignalR hub
📤 Sent test set to hub
📥 Received from hub: testKey testValue
```

---

## ✅ What’s Done

- [x] SignalR server initialized and running
- [x] `CacheHub` set up to handle `SendSet` and respond with `OnSet`
- [x] TypeScript client sends test data and receives response
- [x] `tsconfig.json` updated to compile only `src/`
