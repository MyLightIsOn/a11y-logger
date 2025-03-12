"use client";

import { renderColumns } from "@/components/custom/assessments-list/columns";
import { DataTable } from "@/components/custom/assessments-list/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAssessments = async () => {
  const api_url = `/api/assessments`;
  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch assessments: ${err}`);
  }
};

export default function DemoPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAssessments,
  });

  const schema = [
    { heading: "title", displayName: "Assessment", type: "string" },
    { heading: "progress", displayName: "Status", type: "string" },
    { heading: "platform", displayName: "Platform", type: "string" },
    { heading: "createdAt", displayName: "Created", type: "date" },
    { heading: "updatedAt", displayName: "Last Update", type: "date" },
  ];

  const columns = renderColumns(data, schema, "assessments");

  return (
    <div className="container mx-auto py-10 px-10">
      {isLoading ? (
        <>
          <div className={"flex justify-between mb-4"}>
            <Skeleton className={"w-1/3 h-10"} />
            <Skeleton className={"w-[120px] h-10"} />
          </div>
          <Skeleton className={"w-full h-[500px]"} />
        </>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        data && <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
