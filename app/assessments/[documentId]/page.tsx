"use client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { renderColumns } from "@/components/custom/assessments-list/columns";
import { DataTable } from "@/components/custom/assessments-list/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Subnav from "@/components/custom/subnav";
import { DonutChart } from "@/components/charts/donut";
import { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "Total Issues",
  },
  critical: {
    label: "Critical",
    color: "hsl(var(--chart-1))",
  },
  major: {
    label: "Major",
    color: "hsl(var(--chart-2))",
  },
  minor: {
    label: "Minor",
    color: "hsl(var(--chart-3))",
  },
  enhancement: {
    label: "Enhancement",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const fetchAssessment = async (url: string) => {
  const api_url = url
    ? `/api/assessments?documentId=${url}`
    : `/api/assessments`;

  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch assessments: ${err}`);
  }
};

const countSeverity = (data) => {
  const dataArray = [];
  const chartColors = {
    critical: "var(--color-critical)",
    major: "var(--color-major)",
    minor: "var(--color-minor)",
    enhancement: "var(--color-enhancement)",
  };

  data?.map((issue) => {
    const object = {
      severity: issue.severity,
      count: 1,
    };

    dataArray.push(object);
  });

  const issueCounts = dataArray.reduce((accumulator, current) => {
    if (!accumulator[current.severity]) {
      accumulator[current.severity] = 0;
    }
    accumulator[current.severity] += current.count;
    return accumulator;
  }, {});

  let chartData = [];

  Object.keys(issueCounts).forEach((property) => {
    chartData.push({
      severity: property,
      count: issueCounts[property],
      fill: chartColors[property],
    });
  });

  return {
    chartData,
    issueCounts,
  };
};

function Page() {
  const pathname = usePathname();
  const url = pathname.replace("/assessments/", "");
  let { data, error, isLoading } = useQuery({
    queryKey: ["assessment"],
    queryFn: () => fetchAssessment(url),
  });

  const schema = [
    { heading: "title", displayName: "Title", type: "string" },
    { heading: "severity", displayName: "Severity", type: "string" },
  ];
  const assessment = data;
  data = data?.issues;

  const columns = renderColumns(data, schema);

  const { chartData, issueCounts } = countSeverity(data);

  return (
    <div>
      <Subnav />
      <div className="container mx-auto py-10 px-10">
        <div className={"flex gap-5 mb-5"}>
          {assessment && (
            <Card className={"w-2/3"}>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <div className={"flex"}>
                <CardContent>
                  <p>Total Issues: {data.length}</p>
                </CardContent>
              </div>
            </Card>
          )}

          <div className={"w-1/3"}>
            <DonutChart
              chartData={chartData}
              chartConfig={chartConfig}
              mainLabel={"Total Issues"}
            />
          </div>
        </div>

        <div className={"flex gap-5"}>
          <Card className={"w-2/3 p-5"}>
            {data && <DataTable columns={columns} data={data} />}
          </Card>
          <Card className={"w-1/3"}></Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
