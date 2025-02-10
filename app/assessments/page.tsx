"use client";

import { renderColumns } from "@/components/custom/assessments-list/columns";
import { AssessmentDataTable } from "@/components/custom/assessments-list/data-table";
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

  const columns = renderColumns(data);

  console.log(data);

  return (
    <div className="container mx-auto py-10 px-10">
      {data && <AssessmentDataTable columns={columns} data={data} />}
    </div>
  );
}
