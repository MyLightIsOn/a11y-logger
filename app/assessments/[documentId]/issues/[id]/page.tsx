"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Subnav from "@/components/custom/subnav";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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

  const issue = data;

  console.log(issue);

  return (
    <div>
      <Subnav edit duplicate trash />
      <div className="container mx-auto py-10 px-10">
        <div className={"flex gap-5 mb-5 relative"}>
          {issue && (
            <Card className={"w-2/3"}>
              <CardHeader className={"flex flex-row"}>
                <div>
                  <CardTitle className={"mb-2 text-2xl"}>
                    {issue.title}
                  </CardTitle>
                  <div className={"mt-10"}>
                    <h2 className={"font-bold text-sm"}>Description</h2>
                    <CardDescription className={"text-sm"}>
                      {issue.description}
                    </CardDescription>
                  </div>
                  <div className={"mt-10"}>
                    <h2 className={"font-bold text-sm"}>
                      Why It&apos;s Important:
                    </h2>
                    <CardDescription className={"text-sm"}>
                      {issue.impact}
                    </CardDescription>
                  </div>
                  <div className={"my-10"}>
                    <h2 className={"font-bold text-sm"}>Suggested Fix</h2>
                    <CardDescription className={"text-sm"}>
                      {issue.suggested_fix}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
          <Card className={"w-1/3"}>
            <div className={"mt-10"}>
              <h2 className={"font-bold text-sm"}>Screenshots</h2>
            </div>
            {/*{issue?.tags && (
              <div className={"text-sm flex w-1/2 mt-2"}>
                <span className={"font-bold"}>Tags:</span>{" "}
                <div>
                  {issue.tags.map((tag) => {
                    return (
                      <Badge
                        key={tag.slug}
                        className={"mx-1 my-1 bg-tags dark"}
                      >
                        {tag.title}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}*/}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
