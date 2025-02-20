import { ChartConfig } from "@/components/ui/chart";

export const chartColors = {
  severity1: "--severity-chart-1",
  severity2: "--severity-chart-2",
  severity3: "--severity-chart-3",
  severity4: "--severity-chart-4",
};

export const chartConfig = {
  count: {
    label: "Total Issues",
  },
  severity1: {
    label: "Critical",
    color: "--severity-chart-1",
  },
  severity2: {
    label: "Major",
    color: "--severity-chart-2",
  },
  severity3: {
    label: "Minor",
    color: "--severity-chart-3",
  },
  severity4: {
    label: "Advisory",
    color: "--severity-chart-4",
  },
} satisfies ChartConfig;
