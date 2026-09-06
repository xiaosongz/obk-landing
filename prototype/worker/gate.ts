// Password gate in front of the static site. Runs before every asset request
// (run_worker_first). The password and the cookie-signing key are Worker
// secrets; nothing sensitive is in this file or the repository.
//
//   wrangler secret put SITE_PASSWORD   # the shared entry password
//   wrangler secret put GATE_SECRET     # random string used to sign the cookie

interface Env {
  ASSETS: Fetcher;
  SITE_PASSWORD: string;
  GATE_SECRET: string;
}

const COOKIE = "obk_gate";
const COOKIE_DAYS = 30;
const GATE_PATH = "/__gate";

const encoder = new TextEncoder();

async function sign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(mac)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

async function expectedToken(env: Env): Promise<string> {
  // Binding the token to the password means changing the password logs
  // everyone out; no session store is needed.
  return sign(env.GATE_SECRET, `gate-v1:${env.SITE_PASSWORD}`);
}

function page(body: string, status = 200, extra: HeadersInit = {}): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      ...extra,
    },
  });
}

function loginPage(error = ""): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Obelisk · Preview access</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#faf9f6;color:#16181d;font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
  form{background:#fff;border:1px solid #dcdedc;padding:2.5rem;width:min(92vw,380px);border-radius:4px}
  h1{font-size:1.1rem;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .25rem;color:#1e3a5f}
  p{margin:0 0 1.5rem;color:#656b75;font-size:.95rem}
  label{display:block;font-size:.85rem;margin-bottom:.4rem}
  input{width:100%;box-sizing:border-box;height:44px;padding:0 .75rem;border:1px solid #dcdedc;border-radius:4px;font-size:1rem}
  button{margin-top:1rem;width:100%;height:44px;border:0;border-radius:4px;background:#1e3a5f;color:#fff;font-size:1rem;font-weight:500;cursor:pointer}
  .err{color:#a33;font-size:.9rem;margin:.75rem 0 0}
</style></head><body>
<form method="post" action="${GATE_PATH}">
  <h1>Obelisk Fund Management</h1>
  <p>This preview site is private. Enter the access password to continue.</p>
  <label for="pw">Access password</label>
  <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
  ${error ? `<p class="err">${error}</p>` : ""}
  <button type="submit">Enter</button>
</form></body></html>`;
}

function setCookie(token: string): string {
  return `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === `${GATE_PATH}/logout`) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    if (url.pathname === GATE_PATH) {
      if (request.method !== "POST") return page(loginPage(), 200);
      const form = await request.formData().catch(() => null);
      const supplied = String(form?.get("password") ?? "");
      if (!supplied || !timingSafeEqual(supplied, env.SITE_PASSWORD)) {
        return page(loginPage("Incorrect password."), 401);
      }
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
          "Set-Cookie": setCookie(await expectedToken(env)),
          "Cache-Control": "no-store",
        },
      });
    }

    const token = readCookie(request, COOKIE);
    if (!token || !timingSafeEqual(token, await expectedToken(env))) {
      return page(loginPage(), 401);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set("Cache-Control", "private, no-store");
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
