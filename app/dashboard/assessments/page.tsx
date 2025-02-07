"use client";

import { Payment, columns } from "@/components/custom/assessment-table/columns";
import { AssessmentDataTable } from "@/components/custom/assessment-table/data-table";
import { useQuery } from "@tanstack/react-query";

const fetchAccessibilityIssues = async () => {
  const res = await fetch("/api/assessments");
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return res.json();
};

export default function DemoPage() {
  //const data = await getData();

  const { data, error, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAccessibilityIssues,
  });

  console.log(data);

  return (
    <div className="container mx-auto py-10 px-10">
      {data && <AssessmentDataTable columns={columns} data={data} />}
    </div>
  );
}
