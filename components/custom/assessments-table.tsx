"use client";
import { useQuery } from "@tanstack/react-query";

const fetchAccessibilityIssues = async () => {
  const res = await fetch("/api/assessments");
  if (!res.ok) throw new Error("Failed to fetch assessments");
  return res.json();
};

function AssessmentsTable(props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAccessibilityIssues,
  });

  console.log(data);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>Assessment Table</div>;
}

export default AssessmentsTable;
