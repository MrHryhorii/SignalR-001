
# 📦 SignalR TypeScript Client (`client.ts`)

This file provides a **SignalR client interface** for interacting with a real-time key-value cache server. It handles:
- Authentication via username/password
- WebSocket connection over SignalR
- Cache operations: `set`, `get`, `upsert`
- Server configuration: `strict`, `logLevel`

Tested via `test.ts`.

---

## 🧪 Quick Start with `test.ts`

1. Make sure the server is running:

```bash
cd ../server
dotnet run
```

> Server is expected to run at `http://localhost:5000` by default.

2. Compile and run the client:

```bash
cd ../client-lib
npx tsc
node dist/test.js
```

---

## 🧰 Client API (Functionality)

The client manages both **authentication and SignalR connection**, then exposes methods for key-value interactions.

### 🔐 `connect(auth: { username: string; password: string; serverUrl?: string })`

Authenticates via `/api/authenticate`, then connects to `/hub/cache` using the received JWT.

### 💾 `set<T>(key: string, value: T, options?: { ttl?: number; validate?: boolean })`

Sends a key-value pair to be stored in the cache with optional TTL (time to live) and validation.

### 📥 `get<T>(key: string)`

Fetches the value associated with a key from the cache or backing store.

### 🔁 `upsert<T>(key: string, value: T, options?: { ttl?: number; errorOnExists?: boolean })`

Adds a new value or updates an existing one. If `errorOnExists` is true, it fails if the key exists.

### ⚙️ `config(settings: { strict: boolean; logLevel: number })`

Changes server configuration. Enables strict JSON validation or sets logging level.

---

## 💡 Example from `test.ts`

```ts
import { client } from "./client";

await client.connect({
  username: "user",
  password: "pass",
  serverUrl: "http://localhost:5000"
});

await client.set("count", 1);
const value = await client.get("count");
console.log("Got:", value);

await client.upsert("count", 2, { errorOnExists: false });

await client.config({ strict: true, logLevel: 1 });
```

---

## 📦 Package Requirements

Install required packages before compiling:

```bash
npm install @microsoft/signalr joi
npx tsc --init
```

In your `tsconfig.json`, ensure:

```json
"include": ["src"]
```

---

## 📝 Summary

- The `client.ts` file abstracts all connection/auth details.
- The `test.ts` shows how to use it with real server endpoints.
- The client expects the server to be running with JWT-based auth and a SignalR hub at `/hub/cache`.
