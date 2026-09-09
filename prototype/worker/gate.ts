// Password gate in front of the investor section of the static site. Runs
// before every asset request (run_worker_first).
//
// Public: the home page, the portfolio, the investor login page, and the
// static assets they need. Gated: the investor pages and the fund snapshot
// data under /lp-data. The snapshot file is the only sensitive payload; the
// page routes are gated as well so the investor section is not browsable
// without signing in.
//
// The password and the cookie-signing key are Worker secrets; nothing
// sensitive is in this file or the repository.
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
const LOGIN_PAGE = "/investor-login";
const DEFAULT_NEXT = "/investor-home";

// Route prefixes that require the gate cookie. Everything else is public.
const GATED_PREFIXES = [
  "/investor-home",
  "/fund-iii-portfolio",
  "/property-performance",
  "/lp-data/",
];

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

async function isAuthenticated(request: Request, env: Env): Promise<boolean> {
  const token = readCookie(request, COOKIE);
  return !!token && timingSafeEqual(token, await expectedToken(env));
}

export function isGated(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname === `${prefix}/` ||
      pathname.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`),
  );
}

// Only same-origin, gated destinations are honoured as a post-login target.
export function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_NEXT;
  }
  if (/[\r\n\\]/.test(value)) return DEFAULT_NEXT;
  const pathname = value.split(/[?#]/)[0];
  return isGated(pathname) && !pathname.startsWith("/lp-data/")
    ? value
    : DEFAULT_NEXT;
}

function redirect(location: string, extra: HeadersInit = {}): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "no-store", ...extra },
  });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function setCookie(token: string): string {
  return `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;
}

const clearCookie = `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

function loginRedirect(next: string, error = false): Response {
  const params = new URLSearchParams();
  if (error) params.set("error", "1");
  params.set("next", next);
  return redirect(`${LOGIN_PAGE}?${params}`);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === `${GATE_PATH}/status`) {
      return json({ authenticated: await isAuthenticated(request, env) });
    }

    if (url.pathname === `${GATE_PATH}/logout`) {
      return redirect("/", { "Set-Cookie": clearCookie });
    }

    if (url.pathname === GATE_PATH) {
      if (request.method !== "POST") return redirect(LOGIN_PAGE);
      // The form is same-origin; reject cross-site posts outright.
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin)
        return json({ error: "Forbidden" }, 403);
      const form = await request.formData().catch(() => null);
      const supplied = String(form?.get("password") ?? "");
      const next = safeNext(
        typeof form?.get("next") === "string"
          ? (form.get("next") as string)
          : null,
      );
      if (!supplied || !timingSafeEqual(supplied, env.SITE_PASSWORD)) {
        return loginRedirect(next, true);
      }
      return redirect(next, {
        "Set-Cookie": setCookie(await expectedToken(env)),
      });
    }

    const gated = isGated(url.pathname);
    if (gated && !(await isAuthenticated(request, env))) {
      if (url.pathname.startsWith("/lp-data/")) {
        return json({ error: "Sign in required" }, 401);
      }
      return loginRedirect(url.pathname + url.search);
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    // Preview site: keep search engines out of every page for now.
    headers.set("X-Robots-Tag", "noindex, nofollow");
    if (gated) headers.set("Cache-Control", "private, no-store");
    return new Response(response.body, { status: response.status, headers });
  },
} satisfies ExportedHandler<Env>;
