"use client";

import { renderColumns } from "@/components/custom/assessments-list/columns";
import { AssessmentDataTable } from "@/components/custom/assessments-list/data-table";
import { useQuery } from "@tanstack/react-query";

const fetchAccessibilityIssues = async () => {
  const res = await fetch("/api/assessments");
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return res.json();
};

export default function DemoPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAccessibilityIssues,
  });

  const columns = renderColumns();

  return (
    <div className="container mx-auto py-10 px-10">
      {data && <AssessmentDataTable columns={columns} data={data} />}
    </div>
  );
}
