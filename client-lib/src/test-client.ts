import * as signalR from "@microsoft/signalr";

// Create a connection to the SignalR hub
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hub/cache") // URL of the hub on the server
  .configureLogging(signalR.LogLevel.Information) // Optional: show log messages in console
  .build();

// Start the connection
async function start() {
  try {
    await connection.start(); // Connect to the hub
    console.log("Connected to SignalR hub");

    // Send test data to the hub
    await connection.invoke("SendSet", "testKey", "testValue"); // Call method on server
    console.log("Sent test set to hub");
  } catch (err) {
    console.error("Connection error:", err); // Log connection errors
  }
}

// Handle incoming messages from the hub
connection.on("OnSet", (key, value) => {
  console.log("Received from hub:", key, value); // Show received data
});

// Begin the connection
start();
