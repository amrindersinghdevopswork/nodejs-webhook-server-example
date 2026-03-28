import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import "dotenv/config";
import ngrok from "@ngrok/ngrok";

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

  // Automatically start an Ngrok tunnel for external inbound if token is provided
  if (process.env.NGROK_AUTHTOKEN) {
    try {
      console.log("Starting Ngrok tunnel...");
      const listener = await ngrok.forward({
        addr: port,
        authtoken: process.env.NGROK_AUTHTOKEN
      });
      console.log(`🌍 Ngrok Ingress established at: ${listener.url()}`);
      console.log(`👉 Use this URL to configure your external webhooks.`);
    } catch (error) {
      console.error("❌ Failed to start Ngrok tunnel:", error);
    }
  } else {
    console.log("ℹ️ Provide NGROK_AUTHTOKEN in .env to expose this server externally.");
  }
});
