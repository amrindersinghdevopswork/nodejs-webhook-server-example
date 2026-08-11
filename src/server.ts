import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import "dotenv/config";
import ngrok from "@ngrok/ngrok";
import { startHeartbeat } from "./uptime";

// App
const app = express();

const setRawBody = (req: any, res: any, buf: any) => {
  req.rawBody = buf;
};

app.use(bodyParser.urlencoded({ extended: false, verify: setRawBody }));
app.use(bodyParser.json({ verify: setRawBody }));

// Set port
const port: string | number = process.env.PORT || "1337";
app.set("port", port);

app.use("/", routes);

// Server
app.listen(port, async () => {
  console.log(`Server running on localhost:${port}`);

  const heartbeatUrl = process.env.PING_URL || `http://127.0.0.1:${port}/ping`;
  startHeartbeat({
    pingUrl: heartbeatUrl,
    intervalMs: Number(process.env.PING_INTERVAL_MS || 5 * 60 * 1000),
  });

  // Start Ngrok only for local development/testing when explicitly enabled.
  const shouldStartNgrok = process.env.NODE_ENV !== "production" && Boolean(process.env.NGROK_AUTHTOKEN);
  if (shouldStartNgrok) {
    try {
      console.log("Starting Ngrok tunnel for local development...");
      const listener = await ngrok.forward({
        addr: port,
        authtoken: process.env.NGROK_AUTHTOKEN,
      });
      console.log(`🌍 Ngrok Ingress established at: ${listener.url()}`);
      console.log(`👉 Use this URL to configure your external webhooks.`);
    } catch (error) {
      console.error("❌ Failed to start Ngrok tunnel:", error);
    }
  } else if (process.env.NGROK_AUTHTOKEN) {
    console.log("ℹ️ Ngrok is disabled in production. Remove NGROK_AUTHTOKEN or switch to a local environment to enable it.");
  } else {
    console.log("ℹ️ Ngrok is disabled locally. Set NGROK_AUTHTOKEN in .env to expose this server externally.");
  }
});
