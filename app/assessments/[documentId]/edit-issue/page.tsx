import React from "react";
import { AddIssueForm } from "@/components/forms/add-issue-form";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { EditIssueForm } from "@/components/forms/edit-issue-form";

export default async function AddIssueRoute(props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
      <EditIssueForm />
    </div>
  );
}
