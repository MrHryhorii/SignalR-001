# 📚 SignalR Real-time Key-Value Cache — Client Documentation

This TypeScript library provides a ready-to-use **real-time key-value cache client** for SignalR-based servers. It handles authentication, WebSocket connection, and cache operations like `set`, `get`, `upsert`, and `config`.

Use it to connect to a running SignalR cache server and perform client-side operations in real time.

---

## 🚀 Installation & Setup

### 1. Install via npm

```bash
npm install typescript @microsoft/signalr joi
npx tsc --init
```

Ensure your `tsconfig.json` includes:

```json
"include": ["src"]
```

This tells the TypeScript compiler to look for source files inside the `src/` folder — which is where the client library (`client.ts`, `test.ts`) lives. It's essential for compiling the client code to JavaScript, especially when using `tsc` to run or build the project.

### 2. Add the Client Library

Copy the provided `client.ts` file into your `src/` folder and import the class into your code:

```ts
import { AuthJoiClient } from "./client";

const client = new AuthJoiClient("http://localhost:5000", "user", "pass");
await client.start(); // Authenticate and connect
```

---

## 📦 Connecting to the Cache Server

### Step-by-step:

```ts
import { AuthJoiClient } from "./client";

const client = new AuthJoiClient("http://localhost:5000", "user", "pass");
await client.start();
```

✅ This authenticates via POST to `/api/auth/authenticate`, retrieves a JWT token, and connects to the SignalR hub at `/hub/cache`.

🛡 Token is passed automatically via `access_token` in the WebSocket query.

---

## 🛠 API Methods (with Examples)

### `start()`

Authenticates and connects to the SignalR hub.

```ts
await client.start();
```

---

### `set(key, value, options?)`

Saves a value into the cache.

```ts
await client.set("user:123", { name: "Alice" }, { ttl: 60000 });
```

- `ttl`: optional time-to-live (ms), default: 1 hour
- `validate`: whether to apply schema validation (default: `true`)

---

### `get(key)`

Fetches a value from the cache.

```ts
const user = await client.get("user:123");
console.log(user.name);
```

---

### `upsert(key, value, options?)`

Creates or updates a key in the cache.

```ts
await client.upsert("counter", { clicks: 1 }, { errorOnExists: false });
```

- `errorOnExists`: if `true`, fails if key already exists

---

### `config({ strict, logLevel })`

Configures the server behavior for this session.

```ts
await client.config({ strict: true, logLevel: 0 }); // DEBUG
```

---

## 🧪 How Tests Use the Client (Example from `test.ts`)

```ts
import { AuthJoiClient } from "./client";

const client = new AuthJoiClient("http://localhost:5000", "test", "test");
await client.start();

await client.set("foo", { x: 1 });
const val = await client.get("foo");
console.log(val);

await client.upsert("foo", { x: 2 });
await client.config({ strict: true, logLevel: 1 });
```

Tests follow this general pattern:

1. Create instance of `AuthJoiClient`
2. Call `start()` to connect
3. Use `set`, `get`, `upsert` to test data flow
4. Optionally use `config()` to test strict mode

Each test expects the server to be already running on `localhost:5000`.

---

## ✅ Summary

This client is ideal for real-time projects where cache synchronization via WebSockets is required.

- Easy to use and configure
- Simple API for cache operations
- Auth + SignalR connection built-in
- Ready for integration into modern TypeScript projects

📁 Use the included `test.ts` file as a live reference and integration test example.