"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DonutChart({
  chartData,
  chartConfig,
  chartColors,
  countLabel,
  title,
  description,
}) {
  const totalCount = chartData.reduce((acc, curr) => acc + curr.count, 0);
  const chartTable = [];

  Object.keys(chartData).forEach((property) => {
    chartTable.push(
      <div
        key={chartData[property].label}
        className={"w-1/2 flex justify-between mb-2 pr-16 relative left-5"}
      >
        <div>
          {chartData[property].label.charAt(0).toUpperCase() +
            chartData[property].label.slice(1)}
        </div>
        <div
          style={{ backgroundColor: chartData[property].fill }}
          className={"w-[20px] h-[20px]"}
        ></div>
      </div>,
    );
  });

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          {
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="severity"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalCount}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {countLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          }
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className={"flex flex-wrap w-[300px] m-auto"}>{chartTable}</div>
      </CardFooter>
    </Card>
  );
}
