import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { registerTodosRoutes } from "./routes/todos";
import { createApp as createPublicTodosApp } from "../src/app";
import { createExternalTodosProxy } from "./utils/proxy";
import { corsAll } from "./middleware/corsAll";
import { getExternalApiBase } from "./config";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(corsAll);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    try {
      console.log(`[api] ${req.method} ${req.path}`);
    } catch {}
    next();
  });

  // Optional external API proxy for /todos and /api/todos
  const EXT = getExternalApiBase();
  if (EXT) {
    const PREFIX = process.env.EXTERNAL_TODOS_PREFIX || ""; // e.g. "/api"
    app.use(createExternalTodosProxy(EXT, PREFIX));
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Todos API (with /api prefix)
  registerTodosRoutes(app);

  // Public API without /api prefix (matches requested VSCode src structure): /todos, /todos/scroll, ...
  const publicApi = createPublicTodosApp();
  app.use("/", publicApi);

  return app;
}
