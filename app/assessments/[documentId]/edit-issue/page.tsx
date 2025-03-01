import React from "react";
import { AddIssueForm } from "@/components/forms/add-issue-form";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { EditIssueForm } from "@/components/forms/edit-issue-form";

export default async function AddIssueRoute(props) {
  return (
    <div className="p-4">
      <EditIssueForm />
    </div>
  );
}
