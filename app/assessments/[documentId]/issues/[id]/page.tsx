"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchIssue = async (url: string) => {
  const api_url = `/api/issues?documentId=${url}`;

  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch issues: ${err}`);
  }
};

function Page(props) {
  const pathname = usePathname();
  const url = pathname.split("/");

  let { data, error, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchIssue(url[url.length - 1]),
  });

  console.log(data);

  return <div>Issue Page</div>;
}

export default Page;
