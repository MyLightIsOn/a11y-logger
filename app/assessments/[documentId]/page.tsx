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
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import * as React from "react";
import { chartConfig, chartColors } from "@/static/chart-setup";
import { useRouter } from "next/navigation";

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

  let unsortedData = [];
  Object.keys(issueCounts).forEach((property) => {
    unsortedData.push({
      severity: property,
      count: issueCounts[property],
      fill: `hsl(var(${chartColors[property]}))`,
      label: chartConfig[property].label,
    });
  });

  const chartData = unsortedData.sort((a, b) => {
    if (a.severity < b.severity) {
      return -1;
    }
    if (a.severity > b.severity) {
      return 1;
    }
    return 0;
  });

  return {
    chartData,
    issueCounts,
  };
};

function Page() {
  const router = useRouter();
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
  const issuesURL = `assessments/${assessment?.documentId as string}/issues`;
  data = data?.issues;

  const columns = renderColumns(data, schema, issuesURL);

  const { chartData } = countSeverity(data);
  const chartTable = [];

  chartData.map((issueType) => {
    const label = issueType.label;
    const count = issueType.count;

    chartTable.push(
      <div key={label} className={"flex flex-col text-center text-sm"}>
        <div className={"font-bold"}>
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </div>
        <div className={"text-2xl"}>{count || 0}</div>
      </div>,
    );
  });

  const onClickAction = (type) => {
    if (type === "add") {
      router.push(`/assessments/${assessment?.documentId}/add`);
    }

    console.log(type);
  };

  return (
    <div>
      <Subnav add edit generate trash onClickAction={onClickAction} />
      <div className="container mx-auto py-10 px-10">
        <div className={"flex gap-5 mb-5 relative"}>
          {assessment && (
            <Card className={"w-full"}>
              <CardHeader className={"flex flex-row"}>
                <div className={"w-3/4"}>
                  <CardTitle className={"mb-2"}>{assessment.title}</CardTitle>
                  <CardDescription>{assessment.description}</CardDescription>
                  <div className={"flex mt-5"}>
                    <p className={"text-sm"}>
                      <span className={"font-bold"}>Standard:</span>{" "}
                      {assessment.standard}
                    </p>
                  </div>
                  {assessment?.tags && (
                    <div className={"text-sm flex w-1/2 mt-2"}>
                      <span className={"font-bold"}>Tags:</span>{" "}
                      <div>
                        {assessment.tags.map((tag) => {
                          return (
                            <Badge
                              key={tag.slug}
                              className={"mx-1 my-1 bg-tags dark"}
                            >
                              {tag.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={
                    "w-1/4 h-fit w-fit text-sm bg-gray-100/40 dark:bg-gray-800/40 p-5 absolute top-3 right-5 rounded-lg border-border border"
                  }
                >
                  <p>
                    <span className={"font-bold"}>Date Created:</span>{" "}
                    {formatDate(assessment.createdAt)}
                  </p>
                  {assessment.date_completed && (
                    <p>
                      <span className={"font-bold"}>Date Completed:</span>{" "}
                      {formatDate(assessment.date_completed)}
                    </p>
                  )}
                  {assessment.updatedAt && (
                    <p>
                      <span className={"font-bold"}>Last Update:</span>{" "}
                      {formatDate(assessment.updatedAt)}
                    </p>
                  )}
                  <p>
                    <span className={"font-bold"}>Status:</span>{" "}
                    {assessment.progress.charAt(0).toUpperCase() +
                      assessment.progress.slice(1)}
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>

        <div className={"flex gap-5"}>
          <Card className={"w-2/3 p-5"}>
            {data && <DataTable columns={columns} data={data} />}
          </Card>
          <Card className={"w-1/3"}>
            <DonutChart
              chartData={chartData}
              chartConfig={chartConfig}
              chartColors={chartColors}
              countLabel={"Total Issues"}
              title={"Severity Overview"}
              description={"A Breakdown of Issue Severity"}
            />
            <hr className={"w-[80%] m-auto border-gray-500"} />
            <div className={"flex justify-between p-5 max-w-[300px] m-auto"}>
              {chartTable}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
