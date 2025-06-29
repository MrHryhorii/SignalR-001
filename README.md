
# 📚 SignalR Real-time Key-Value Cache — Client Documentation

This project implements a real-time **key-value cache server** using ASP.NET Core SignalR, with a reusable **TypeScript client library** (`client.ts`) that handles connection, authentication, and communication over WebSockets.

The main focus of this documentation is the **client-side interface**, providing all necessary details to interact with the SignalR server — either by using the included `client.ts` or implementing a custom client.

---

## 📦 Project Structure

```
SignalR-001/
├── server/            # C# ASP.NET Core SignalR server
└── client-lib/        # TypeScript client library
    └──src/            # TypeScript code folder
       ├── client.ts   # SignalR client module (focus of this doc)
       └── test.ts     # Example usage and test driver
```

---

## 🎯 Overview of the Client

`client.ts` provides a simple, high-level API for authenticating with the server and performing cache operations in real-time.

It wraps:
- JWT-based authentication
- SignalR connection management
- Remote procedure calls to server hub methods: `Set`, `Get`, `Upsert`, `Config`

This client module can be reused across other TypeScript projects or serve as a reference for building your own implementation.

---

## 🚀 How to Use the Client

### 1. Install Dependencies

```bash
npm install @microsoft/signalr joi
npx tsc --init
```

In your `tsconfig.json`, include the source folder:

```json
"include": ["src"]
```

### 2. Run the Server (for testing)

In a separate terminal:

```bash
cd ../server
dotnet run
```

By default, the server listens on:

- SignalR Hub: `http://localhost:5000/hub/cache`
- Auth Endpoint: `http://localhost:5000/api/authenticate`

---

## 🧪 Example Test (`test.ts`)

```ts
import { client } from "./client";

await client.connect({
  username: "user",
  password: "pass",
  serverUrl: "http://localhost:5000"
});

await client.set("foo", { count: 1 });
const data = await client.get("foo");

console.log("Fetched from server:", data);

await client.upsert("foo", { count: 2 }, { errorOnExists: false });

await client.config({ strict: true, logLevel: 1 }); // INFO
```

This test file demonstrates full client usage: connecting, sending data, receiving values, and updating server settings.

---

## 🛠 Client API Reference

### `connect(credentials: { username: string; password: string; serverUrl?: string }): Promise<void>`

Authenticates with the backend via `/api/authenticate` and connects to the SignalR hub using the returned JWT.

### `set<T>(key: string, value: T, options?: { ttl?: number; validate?: boolean }): Promise<any>`

Stores a key-value pair in the server cache.

- `ttl`: Time-to-live in ms (default: 3600000)
- `validate`: Whether to validate data (default: true)

### `get<T>(key: string): Promise<T>`

Fetches a value from the cache using the provided key.

### `upsert<T>(key: string, value: T, options?: { ttl?: number; errorOnExists?: boolean }): Promise<any>`

Creates or updates a value in the cache.

- `errorOnExists`: If true, fails when the key already exists

### `config(settings: { strict: boolean; logLevel: number }): Promise<void>`

Sends configuration to the server:
- `strict`: Enable or disable strict validation on the server
- `logLevel`: Logging verbosity (0=DEBUG, 1=INFO, 2=WARNING, 3=ERROR)

---

## 🔌 Protocol & Communication

The client connects to the SignalR server at `/hub/cache` and authenticates using a JWT provided by `/api/authenticate`.

All calls to `set`, `get`, `upsert`, and `config` are **SignalR method invocations** sent over WebSocket with token authentication.

### Message Flow
1. Client sends credentials to `/api/authenticate`
2. Server returns a signed JWT token
3. Client connects to `/hub/cache` with the token via `access_token` query parameter
4. All operations go through authenticated SignalR RPC calls

---

## 🧱 Build Your Own Client

To implement your own SignalR client (in TypeScript, JavaScript, or another language with SignalR support):

1. Connect to: `http://<server>/hub/cache`
2. Authenticate via POST to: `http://<server>/api/authenticate`
3. Use the token in `accessTokenFactory` or URL param `access_token`
4. Invoke the following hub methods:
   - `Set(string key, string value, SetOptions)`
   - `Get(string key, GetOptions)`
   - `Upsert(string key, string value, UpsertOptions)`
   - `Config(ServerConfig)`

The values must be serialized as JSON strings.

---

## ✅ Summary

This documentation focuses on the client interface provided in `client.ts`, showing how to:
- Authenticate and connect
- Send and fetch values
- Modify server behavior
- Reuse the client in other projects

Use `test.ts` as a functional reference to verify integration and explore the real-time behavior.