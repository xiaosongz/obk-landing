import { useEffect, useState } from "react";

// Asks the Worker whether the gate cookie is present. The cookie is HttpOnly,
// so this endpoint is the only way the client can know. In local review the
// Vite plugin answers "authenticated" so every page stays browsable.
export type GateStatus = "unknown" | "in" | "out";

export const gatedPaths = [
  "/investor-home",
  "/fund-iii-portfolio",
  "/property-performance",
];

export function isGatedPath(pathname: string): boolean {
  return gatedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function useGateStatus(): GateStatus {
  const [status, setStatus] = useState<GateStatus>("unknown");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/__gate/status", {
      signal: controller.signal,
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((body: { authenticated?: boolean } | null) => {
        if (controller.signal.aborted) return;
        setStatus(body?.authenticated ? "in" : "out");
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("out");
      });
    return () => controller.abort();
  }, []);
  return status;
}
