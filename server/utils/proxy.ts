import type { Request, Response, NextFunction } from "express";

export function createExternalTodosProxy(base: string, prefix = "") {
  const targetBase = base.replace(/\/$/, "");
  const pre = prefix ? `/${prefix.replace(/^\/+|\/+$/g, "")}` : "";
  return async function proxy(req: Request, res: Response, next: NextFunction) {
    try {
      // Only handle /api/todos* or /todos*
      const path = req.path;
      if (!/^\/(api\/)?todos(\/.*)?$/.test(path)) return next();

      // Map /api/todos -> /todos on target, and allow external prefix like /api
      const relPath = path.startsWith("/api/") ? path.slice(4) : path;
      const url = `${targetBase}${pre}${relPath}`;
      const method = req.method.toUpperCase();

      const headers: Record<string, string> = {};
      Object.entries(req.headers).forEach(([k, v]) => {
        if (k === "host") return;
        if (Array.isArray(v)) headers[k] = v.join(", ");
        else if (typeof v === "string") headers[k] = v;
      });

      let body: any = undefined;
      if (method !== "GET" && method !== "HEAD") {
        if (headers["content-type"]?.includes("application/json")) {
          body = JSON.stringify(req.body ?? {});
        } else if (
          headers["content-type"]?.includes("application/x-www-form-urlencoded")
        ) {
          const params = new URLSearchParams(req.body ?? {});
          body = params.toString();
        } else {
          body = req.body as any;
        }
      }

      const qs = req.originalUrl.includes("?")
        ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
        : "";
      const resp = await fetch(url + qs, {
        method,
        headers,
        body,
      });

      res.status(resp.status);
      // CORS for clients from any origin
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS,HEAD",
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With",
      );
      // Copy headers selectively
      resp.headers.forEach((val, key) => {
        if (key.toLowerCase() === "content-encoding") return;
        if (key.toLowerCase() === "transfer-encoding") return;
        res.setHeader(key, val);
      });

      const buffer = Buffer.from(await resp.arrayBuffer());
      res.send(buffer);
    } catch (err) {
      next(err);
    }
  };
}
