"use client";

import { useState } from "react";
import { renderColumns } from "@/components/custom/assessments-list/columns";
import { DataTable } from "@/components/custom/assessments-list/data-table";
import { AlertCircleOutlinIcon } from "@/components/icons/circle-alert-2";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Subnav from "@/components/custom/subnav";

import CustomDialog from "@/components/custom/dialog";

import { Plus } from "lucide-react";
import { SubNavConfigProps } from "@/types/subnav";
import { useRouter } from "next/navigation";

const fetchAssessments = async () => {
  const api_url = `/api/assessments`;
  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

export default function AssessmentPage() {
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  const { data, error, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAssessments,
  });

  const router = useRouter();

  const schema = [
    { heading: "title", displayName: "Assessment", type: "string" },
    { heading: "progress", displayName: "Status", type: "string" },
    { heading: "platform", displayName: "Platform", type: "string" },
    { heading: "createdAt", displayName: "Created", type: "date" },
    { heading: "updatedAt", displayName: "Last Update", type: "date" },
  ];

  const columns = renderColumns(
    data,
    schema,
    "assessments",
    setOpen,
    setDialogContent,
  );

  const subNavConfig: SubNavConfigProps[] = [
    {
      action: () => router.push("/assessments/create"),
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
          <div className={"flex justify-between mb-4 px-10 pt-10"}>
            <Skeleton className={"w-1/3 h-10"} />
            <Skeleton className={"w-[120px] h-10"} />
          </div>
          <div className={"px-10"}>
            <Skeleton className={"w-full h-[500px]"} />
          </div>
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

      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        content={dialogContent}
      />
    </div>
  );
}
