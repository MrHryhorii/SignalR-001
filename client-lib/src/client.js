"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthJoiClient = void 0;
const signalR = __importStar(require("@microsoft/signalr"));
const joi_1 = __importDefault(require("joi"));
class AuthJoiClient {
    constructor(baseUrl, username, password) {
        this.baseUrl = baseUrl;
        this.username = username;
        this.password = password;
        this.token = null;
        // Connect to SignalR with token
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(baseUrl + "/hub/cache", {
            accessTokenFactory: () => { var _a; return (_a = this.token) !== null && _a !== void 0 ? _a : ""; },
        })
            .configureLogging(signalR.LogLevel.Information)
            .build();
    }
    // Authenticate with credentials and get JWT
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticate();
            yield this.connection.start();
            console.log("Connected to server.");
        });
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default.object({
                username: joi_1.default.string().min(3).required(),
                password: joi_1.default.string().min(4).required(),
            });
            const { error } = schema.validate({
                username: this.username,
                password: this.password,
            });
            if (error)
                throw new Error(`Validation error: ${error.message}`);
            const res = yield fetch(this.baseUrl + "/api/auth/authenticate", {
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
            const json = yield res.json();
            this.token = json.token;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.stop();
            console.log("Disconnected.");
        });
    }
    //
    set(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.connection.invoke("Set", key, value, options || {});
            console.log("[SET]", result);
            return result;
        });
    }
    get(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.connection.invoke("Get", key, options || {});
            console.log("[GET]", result);
            return result;
        });
    }
    upsert(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.connection.invoke("Upsert", key, value, options);
            console.log("[UPSERT]", result);
            return result;
        });
    }
}
exports.AuthJoiClient = AuthJoiClient;
