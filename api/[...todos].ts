import serverless from "serverless-http";
import { createApp } from "../src/app";

// This exposes the same in-memory dummy API used in dev:
// GET /api/todos, /api/todos/scroll, POST /api/todos, PUT /api/todos/:id, DELETE /api/todos/:id
export default serverless(createApp());
