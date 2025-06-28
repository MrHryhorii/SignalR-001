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
const client_1 = require("./client");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.AuthJoiClient("http://localhost:5000", "user", // username
        "pass" // password
        );
        try {
            yield client.start();
            // Send request to set a value
            yield client.set("exampleKey", "123");
            // Retrieve the value
            yield client.get("exampleKey");
            // Update the value or insert if not exists
            yield client.upsert("exampleKey", '{"updated":true}');
            // Retrieve again
            yield client.get("exampleKey");
        }
        catch (err) {
            console.error("Error:", err);
        }
        finally {
            yield client.stop();
        }
    });
}
main();
