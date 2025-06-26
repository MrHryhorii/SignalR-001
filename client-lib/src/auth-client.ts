import { HubConnectionBuilder } from "@microsoft/signalr";

const credentials = {
  username: "user",
  password: "pass"
};

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

(async () => {
  try {
    const token = await authenticate(credentials.username, credentials.password);

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/hub/cache", {
        accessTokenFactory: () => token,
      })
      .build();

    connection.onclose(err => {
      console.error("Connection closed:", err);
    });

    await connection.start();
    console.log("Connected with token:", token);

  } catch (err: any) {
    console.error("Error:", err.message);
  }
})();
