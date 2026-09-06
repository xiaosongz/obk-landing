import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Plugin, Connect } from "vite";
import { parseFundSnapshot } from "./src/fund-data";

// Local review only. This file is never bundled, copied to public/, or deployed.
function privateFundReport(): Plugin {
  const middleware: Connect.NextHandleFunction = async (
    request,
    response,
    next,
  ) => {
    if (request.url?.split("?")[0] !== "/lp-data/fund-iii.json") return next();
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const local = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(
      request.socket.remoteAddress ?? "",
    );
    const localHost = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(
      request.headers.host ?? "",
    );
    // Reject cross-origin browser requests even if dev-server CORS is enabled.
    const origin = request.headers.origin;
    if (
      !local ||
      !localHost ||
      (origin && origin !== `http://${request.headers.host}`)
    ) {
      response.statusCode = 403;
      response.end('{"error":"Local review only"}');
      return;
    }
    if (request.method !== "GET") {
      response.statusCode = 405;
      response.end('{"error":"Method not allowed"}');
      return;
    }
    // Explicit private path first; otherwise the gitignored demo export in
    // public/lp-data/ (the same file a static build would serve).
    const path =
      process.env.OBK_LP_DATA_FILE ||
      fileURLToPath(new URL("./public/lp-data/fund-iii.json", import.meta.url));
    try {
      await access(path);
    } catch {
      response.statusCode = 503;
      response.end('{"error":"Report not yet supplied"}');
      return;
    }
    try {
      const snapshot = parseFundSnapshot(
        JSON.parse(await readFile(path, "utf8")),
      );
      response.end(JSON.stringify(snapshot));
    } catch {
      response.statusCode = 503;
      response.end('{"error":"Report unavailable"}');
    }
  };
  return {
    name: "private-fund-report",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({ plugins: [react(), privateFundReport()] });
