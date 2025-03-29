import React from "react";
import { AnalyzieIssueForm } from "@/components/forms/analyzie-issue-form";

export default async function AddIssueRoute() {
  return (
    <div className="p-4">
      <AnalyzieIssueForm />
    </div>
  );
}
