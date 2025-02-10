"use client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { renderColumns } from "@/components/custom/assessments-list/columns";
import { AssessmentDataTable } from "@/components/custom/assessments-list/data-table";

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
    { heading: "standard", displayName: "Standard", type: "string" },
  ];

  data = data?.issues;

  const columns = renderColumns(data, schema);

  return (
    <div className="container mx-auto py-10 px-10">
      {data && <AssessmentDataTable columns={columns} data={data} />}
    </div>
  );
}

export default Page;
