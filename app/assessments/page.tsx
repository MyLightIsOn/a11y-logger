"use client";

import { renderColumns } from "@/components/custom/assessments-list/columns";
import { DataTable } from "@/components/custom/assessments-list/data-table";
import { AlertCircleOutlinIcon } from "@/components/icons/circle-alert-2";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Subnav from "@/components/custom/subnav";

import { Plus } from "lucide-react";
import { SubNavConfigProps } from "@/types/subnav";

const fetchAssessments = async () => {
  const api_url = `/api/assessments`;
  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`${err}`);
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

  const subNavConfig: SubNavConfigProps[] = [
    {
      action: () => console.log("add assessment"),
      variant: "success",
      text: "Add Assessment",
      icon: <Plus />,
    },
  ];

  return (
    <div className="container mx-auto h-full">
      <Subnav config={subNavConfig} />

      {isLoading ? (
        <>
          <div className={"flex justify-between mb-4"}>
            <Skeleton className={"w-1/3 h-10"} />
            <Skeleton className={"w-[120px] h-10"} />
          </div>
          <Skeleton className={"w-full h-[500px]"} />
        </>
      ) : error ? (
        <div className={"flex items-center align-middle h-full"}>
          <div className={"flex flex-col mx-auto justify-center text-center"}>
            <AlertCircleOutlinIcon className={"mb-4"} height={"3em"} />
            <p className={"mb-4"}>Uh oh, something went wrong!</p>
            <p className={"mb-4 italic text-sm"}>
              Make note of the error below & contact{" "}
              <a className={"underline"} href="mailto:test@test.com">
                support
              </a>
              :
            </p>
            <p className={"border p-4 dark:bg-gray-900"}>
              Error: {error.message}
            </p>
          </div>
        </div>
      ) : (
        data && (
          <div className={"p-10"}>
            <DataTable columns={columns} data={data} />
          </div>
        )
      )}
    </div>
  );
}
