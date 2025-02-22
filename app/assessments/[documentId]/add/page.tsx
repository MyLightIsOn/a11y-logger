import React from "react";
import { AddIssueForm } from "@/components/forms/add-issue-form";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";

export default async function AddIssueRoute(props) {
  const user = await getUserMeLoader();
  const userData = user.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      <AddIssueForm data={userData} className="col-span-3" />
    </div>
  );
}
