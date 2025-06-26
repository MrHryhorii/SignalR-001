import { HubConnectionBuilder } from "@microsoft/signalr";
import { authSchema } from "./authValidator";

const credentials = {
  username: "user",
  password: "pass"
};

// Joi validation
const { error } = authSchema.validate(credentials);
if (error) {
  console.error("Validation error:", error.details.map(d => d.message).join("; "));
  // Зупиняємо виконання
} else {
  authenticate(credentials.username, credentials.password)
    .then(token => {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5000/hub/cache", {
          accessTokenFactory: () => token,
        })
        .build();

      connection.onclose(err => {
        console.error("Connection closed:", err);
      });

      connection.start()
        .then(() => {
          console.log("Connected with token:", token);
        })
        .catch(err => {
          console.error("Connection error:", err);
        });
    })
    .catch(err => {
      console.error("Authentication failed:", err.message);
    });
}

async function authenticate(username: string, password: string): Promise<string> {
  const response = await fetch("http://localhost:5000/api/auth/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Authentication failed: ${response.status} ${errText}`);
  }

  const json = (await response.json()) as { token: string };
  return json.token;
}
