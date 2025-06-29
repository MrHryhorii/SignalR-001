
# 📦 SignalR TypeScript Client Module (`client.ts`)

This module provides a TypeScript API to interact with a real-time SignalR-based key-value cache server. It manages connection, authentication, and data methods (`set`, `get`, `upsert`, `config`) over WebSocket using the SignalR protocol.

---

## 🔧 Installation

Ensure your project has the following dependencies installed:

```bash
npm install @microsoft/signalr joi
npx tsc --init    # if you haven't already
```

In `tsconfig.json`, add:

```json
"include": ["src"]
```

---

## 🛠️ Usage

Import and use the client in your project:

```ts
import { client } from "./client";

(async () => {
  await client.connect({ username: "user", password: "pass" });

  await client.set("someKey", { value: 42 });
  const result = await client.get("someKey");
  console.log("Result:", result);

  await client.upsert("someKey", { value: 99 });
  await client.config({ strict: true, logLevel: 1 }); // INFO
})();
```

---

## 📚 API

### `client.connect(credentials: { username: string, password: string }): Promise<void>`
Authenticates the client and connects to the SignalR hub using a JWT token.

### `client.set(key: string, value: any, options?: { ttl?: number, validate?: boolean }): Promise<any>`
Stores a key-value pair. Optional TTL and validation.

### `client.get(key: string): Promise<any>`
Retrieves a value by key from the server.

### `client.upsert(key: string, value: any, options?: { ttl?: number, errorOnExists?: boolean }): Promise<any>`
Adds or updates a value.

### `client.config(settings: { strict: boolean, logLevel: number }): Promise<void>`
Reconfigures the server with new settings.

---

## 🌐 Server Requirements

This module assumes the server is running at:

- **Hub**: `http://localhost:5000/hub/cache`
- **Auth**: `http://localhost:5000/api/authenticate`

The server must return a valid JWT token when posting to `/api/authenticate`.

---

## 📁 File Location

This file is intended to live in `src/client.ts` or be imported as a library module in your TypeScript project.

---

## 🧪 Testing

You can use the provided `test.ts` script for testing client methods. Compile and run with:

```bash
npx tsc
node dist/test.js
```

---

## 📜 License

Provided as part of a learning assignment. You may reuse or extend as needed.

---

## ▶️ Starting the Server for Testing

To test this client, you must start the accompanying SignalR server from the `/server` directory.

### Prerequisites
- [.NET 6 SDK](https://dotnet.microsoft.com/download)

### Steps

```bash
cd ../server
dotnet restore
dotnet run
```

The server will listen on:
- SignalR Hub: `http://localhost:5000/hub/cache`
- Auth endpoint: `http://localhost:5000/api/authenticate`

Make sure the server is running **before** executing the client code.

---
