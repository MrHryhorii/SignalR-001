"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const signalr_1 = require("@microsoft/signalr");
const credentials = {
    username: "user",
    password: "pass"
};
function authenticate(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:5000/api/auth/authenticate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            const errText = yield response.text();
            throw new Error(`Authentication failed: ${response.status} ${errText}`);
        }
        const json = (yield response.json());
        return json.token;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield authenticate(credentials.username, credentials.password);
        const connection = new signalr_1.HubConnectionBuilder()
            .withUrl("http://localhost:5000/hub/cache", {
            accessTokenFactory: () => token,
        })
            .build();
        connection.onclose(err => {
            console.error("Connection closed:", err);
        });
        yield connection.start();
        console.log("Connected with token:", token);
    }
    catch (err) {
        console.error("Error:", err.message);
    }
}))();
