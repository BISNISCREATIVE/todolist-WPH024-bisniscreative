import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "../server";

// Reuse a single Express instance across invocations
const app = createServer();

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Delegate to Express (supports both /api/todos and plain /todos via mounted apps)
  (app as any)(req, res);
}
