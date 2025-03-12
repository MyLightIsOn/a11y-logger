import React from "react";
import { AnalyzieIssueForm } from "@/components/forms/analyzie-issue-form";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";

export default async function AddIssueRoute(props) {
  const user = await getUserMeLoader();
  const userData = user.data;

  return (
    <div className="p-4">
      <AnalyzieIssueForm data={userData} />
    </div>
  );
}
