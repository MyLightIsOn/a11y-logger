import React from "react";
import { EditIssueForm } from "@/components/forms/edit-issue-form";
import AddIssueImagesForm from "@/components/forms/add-issue-images-form";

export default async function AddIssueRoute(props) {
  return (
    <div className="p-4">
      <AddIssueImagesForm />
      <EditIssueForm />
    </div>
  );
}
