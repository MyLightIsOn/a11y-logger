"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
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
import ImageGallery from "@/components/custom/image-gallery";
import { IMAGE_URL } from "@/static/const";
import OctagonAlert from "@/components/icons/octagon-alert";
import TriangleAlert from "@/components/icons/triangle-alert";
import CircleAlert from "@/components/icons/circle-alert";
import { SubNavConfigProps } from "@/types/subnav";
import { Edit, TrashIcon } from "lucide-react";

const renderSeverityIcon = (severity) => {
  const severityObject = {
    severityText: "",
    severityIcon: undefined,
  };

  if (severity === "severity1") {
    severityObject.severityText = "Critical";
    severityObject.severityIcon = <OctagonAlert />;
  }

  if (severity === "severity2") {
    severityObject.severityText = "Major";
    severityObject.severityIcon = <TriangleAlert />;
  }

  if (severity === "severity3") {
    severityObject.severityText = "Minor";
    severityObject.severityIcon = <CircleAlert />;
  }

  if (severity === "severity4") {
    severityObject.severityText = "Other";
    severityObject.severityIcon = <CircleAlert color="hsl(198 17% 71%)" />;
  }

  return severityObject;
};

const fetchIssue = async (url: string) => {
  const api_url = `/api/issues?issue_id=${url}`;

  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch issues: ${err}`);
  }
};

const organizeScreenshots = (images) => {
  const screenshots = [];

  images?.map((image) => {
    screenshots.push({
      largeURL: IMAGE_URL + image.url,
      thumbnailURL: IMAGE_URL + image.formats.thumbnail.url,
      width: image.width,
      height: image.height,
    });
  });
  return screenshots;
};

function Page(props) {
  const pathname = usePathname();
  const url = pathname.split("/");

  let { data, error, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchIssue(url[url.length - 1]),
  });

  const issue = data;
  const screenshots = organizeScreenshots(issue?.screenshots);
  const { severityText, severityIcon } = renderSeverityIcon(issue?.severity);

  const router = useRouter();

  const onClickAction = (type: string) => {
    if (type === "edit-issue") {
      router.push(
        `/assessments/${url[2]}/edit-issue?issue_id=${issue.documentId}&assessment_id=${url[2]}`,
      );
    }
    if (type === "delete-issue") {
      console.log("delete");
    }
  };

  const subNavConfig: SubNavConfigProps[] = [
    {
      action: () => onClickAction("edit-issue"),
      variant: "default",
      text: "Edit Issue",
      icon: <Edit />,
    },
    {
      action: () => onClickAction("delete-issue"),
      variant: "destructive",
      text: "Delete Issue",
      icon: <TrashIcon />,
    },
  ];

  return (
    <>
      {isLoading ? (
        <>Loading</>
      ) : error ? (
        <>Error</>
      ) : (
        issue && (
          <div>
            <Subnav config={subNavConfig} />
            <div className="container mx-auto py-10 px-10">
              <div className={"flex gap-5 mb-5 relative"}>
                {issue && (
                  <Card className={"w-2/3"}>
                    <CardHeader className={"flex flex-row"}>
                      <div>
                        <CardTitle className={"mb-2 text-2xl relative"}>
                          {issue.title}
                        </CardTitle>
                        <div>
                          <h2 className={"font-bold flex"}>
                            Severity:
                            <span
                              className={"ml-2 flex items-center font-normal"}
                            >
                              {severityText}{" "}
                              <span className={"block ml-2"}>
                                {severityIcon}
                              </span>
                            </span>
                          </h2>
                        </div>
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
                        {issue?.tags && (
                          <div className={"text-sm flex w-1/2 mt-2"}>
                            <span className={"font-bold"}>Tags:</span>{" "}
                            <div>
                              {issue.tags?.map((tag) => {
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
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                )}
                <Card className={"w-1/3 max-w-[400px] h-fit"}>
                  <div className={"p-6"}>
                    <h2 className={"font-bold text-sm text-center mb-6"}>
                      Screenshots
                    </h2>
                    <ImageGallery
                      galleryID="my-test-gallery"
                      images={screenshots}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}

export default Page;
