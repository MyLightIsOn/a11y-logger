"use client";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  const { data, error, isLoading } = useQuery({
    queryKey: ["assessment"],
    queryFn: () => fetchAssessment(url),
  });

  console.log(data);

  return <div>ID Page</div>;
}

export default Page;
