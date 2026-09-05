import { useEffect, useRef } from "react";
import { init, use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  AriaComponent,
} from "echarts/components";
import { SVGRenderer } from "echarts/renderers";
import { distributionSeries, monthLabels, money } from "./data";

use([LineChart, GridComponent, TooltipComponent, AriaComponent, SVGRenderer]);

export function DistributionChart({ months }: { months: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chart = init(ref.current!, undefined, { renderer: "svg" });
    chart.setOption({
      animation: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      aria: { enabled: true },
      grid: { left: 48, right: 18, top: 20, bottom: 30 },
      tooltip: { trigger: "axis", valueFormatter: (v: number) => money(v) },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: monthLabels.slice(0, months),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#727780", fontFamily: "Archivo" },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 20000,
        interval: 5000,
        axisLabel: {
          formatter: (v: number) => `$${v / 1000}k`,
          color: "#727780",
        },
        splitLine: { lineStyle: { color: "#ececea", type: "dashed" } },
      },
      series: [
        {
          name: "Cumulative income distributions",
          type: "line",
          data: distributionSeries.slice(0, months),
          symbol: "circle",
          symbolSize: 5,
          lineStyle: { width: 2.5, color: "#1e3a5f" },
          itemStyle: { color: "#1e3a5f" },
          areaStyle: { color: "#edf1f5", opacity: 0.65 },
        },
      ],
    });
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(ref.current!);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [months]);
  return (
    <div
      ref={ref}
      className="distribution-chart"
      role="img"
      aria-label={`Illustrative cumulative income distributions, ${monthLabels[0]} through ${monthLabels[months - 1]}: ${money(distributionSeries[months - 1])}. Capital returned is excluded.`}
    />
  );
}
