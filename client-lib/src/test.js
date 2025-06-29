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
        var _a, _b;
        const client = new client_1.AuthJoiClient("http://localhost:5000", "user", // username
        "pass" // password
        );
        try {
            yield client.start();
            // Send request to set a value
            yield client.set("exampleKey", "123", { ttl: 10000 });
            // Retrieve the value
            yield client.get("exampleKey", { timeout: 5000 });
            // Retrieve the value of user:1
            yield client.get("user:1");
            // Update the value or insert if not exists
            yield client.upsert("exampleKey", '{"updated":true}');
            // First upsert (should work)
            yield client.upsert("exampleKey", '{"updated":true}', { errorOnExists: false });
            // This upsert should fail because errorOnExists = true and the key exists
            const result = yield client.upsert("exampleKey", '{"shouldFail":true}', { errorOnExists: true });
            if (!result.success) {
                console.warn("[EXPECTED FAILURE]", (_b = (_a = result.error) === null || _a === void 0 ? void 0 : _a.details) !== null && _b !== void 0 ? _b : "Unknown error");
            }
            else {
                console.error("[UNEXPECTED SUCCESS] Upsert should have failed but didn't.");
            }
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
