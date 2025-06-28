import { AuthJoiClient } from "./client";

async function main() {
    const client = new AuthJoiClient(
        "http://localhost:5000",
        "user", // username
        "pass"  // password
    );

    try {
        await client.start();

        // Send request to set a value
        await client.set("exampleKey", "123");

        // Retrieve the value
        await client.get("exampleKey");

        // Retrieve the value of user:1
        await client.get("user:1");

        // Update the value or insert if not exists
        await client.upsert("exampleKey", '{"updated":true}');

        // Retrieve again
        await client.get("exampleKey");
    } 
    catch (err) {
        console.error("Error:", err);
    } 
    finally {
        await client.stop();
    }
}

main();
