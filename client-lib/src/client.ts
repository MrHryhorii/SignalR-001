import * as signalR from "@microsoft/signalr";
import Joi from "joi";

interface UpsertOptions {
    ttl?: number;
    errorOnExists?: boolean;
}

export interface SetOptions {
    ttl?: number;
    schema?: any; // Joi schema — if we need
    validate?: boolean;
}

export interface GetOptions {
    timeout?: number;
    callback?: (...args: unknown[]) => void;
}

export class AuthJoiClient {
    private connection: signalR.HubConnection;
    private token: string | null = null;

    constructor(
        private baseUrl: string,
        private username: string,
        private password: string
    ) {
        // Connect to SignalR with token
        this.connection = new signalR.HubConnectionBuilder()
        .withUrl(baseUrl + "/hub/cache", {
            accessTokenFactory: () => this.token ?? "",
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();
    }
    // Authenticate with credentials and get JWT
    async start() {
        await this.authenticate();
        await this.connection.start();
        console.log("Connected to server.");
    }

    private async authenticate() {
        const schema = Joi.object({
            username: Joi.string().min(3).required(),
            password: Joi.string().min(4).required(),
        });

        const { error } = schema.validate({
            username: this.username,
            password: this.password,
        });

        if (error) throw new Error(`Validation error: ${error.message}`);

        const res = await fetch(this.baseUrl + "/api/auth/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: this.username,
                password: this.password,
            }),
        });

        if (!res.ok) {
            throw new Error(`Auth failed: ${res.statusText}`);
        }

        const json = await res.json();
        this.token = json.token;
    }

    async stop() {
        await this.connection.stop();
        console.log("Disconnected.");
    }

    //

    async set(key: string, value: string, options?: SetOptions) {
        const result = await this.connection.invoke("Set", key, value, options || {});
        console.log("[SET]", result);
        return result;
    }

    async get(key: string, options?: GetOptions) {
        const result = await this.connection.invoke("Get", key, options || {});
        console.log("[GET]", result);
        return result;
    }

    async upsert(key: string, value: string, options?: UpsertOptions) {
        const result = await this.connection.invoke("Upsert", key, value, options);
        console.log("[UPSERT]", result);
        return result;
    }
}