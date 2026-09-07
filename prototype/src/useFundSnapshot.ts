import { useEffect, useState } from "react";
import { parseFundSnapshot } from "./fund-data";
import type { FundSnapshot } from "./fund-data";

type ReportState =
  | { state: "loading" | "unavailable" | "error"; data: null }
  | { state: "ready"; data: FundSnapshot };

export function useFundSnapshot(): ReportState {
  const [report, setReport] = useState<ReportState>({
    state: "loading",
    data: null,
  });
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}lp-data/fund-iii.json`,
          {
            signal: controller.signal,
            cache: "no-store",
            credentials: "same-origin",
            redirect: "error",
          },
        );
        if ([404, 503].includes(response.status)) {
          setReport({ state: "unavailable", data: null });
          return;
        }
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("application/json")
        )
          throw new Error("Report unavailable");
        const data = parseFundSnapshot(await response.json());
        if (!controller.signal.aborted) setReport({ state: "ready", data });
      } catch {
        if (!controller.signal.aborted)
          setReport({ state: "error", data: null });
      }
    }
    void load();
    return () => controller.abort();
  }, []);
  return report;
}
