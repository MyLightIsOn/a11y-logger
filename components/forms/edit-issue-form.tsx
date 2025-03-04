"use client";
import React, { use, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useActionState } from "react";

import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { addIssueAction } from "@/data/actions/issue-actions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function snakeToTitle(str) {
  // Replace underscores with spaces
  let result = str.replace(/_/g, " ");
  // Convert to title case
  result = toTitleCase(result);
  return result;
}

const buildForm = ({ formData }) => {
  const form = [];

  Object.keys(formData).forEach((key) => {
    const displayTitle = snakeToTitle(key);
    const formKey = key;
    const formValue = formData[key];
    let formElement;

    if (formKey !== "specs") {
      formElement = (
        <Input
          key={formKey}
          id={formKey}
          name={formKey}
          placeholder={displayTitle}
          defaultValue={formValue || ""}
        />
      );

      form.push(formElement);
    }
  });

  return form;
};

export function EditIssueForm({ className }: { readonly className?: string }) {
  const searchParams = useSearchParams();

  // Get a specific query parameter
  const formData = JSON.parse(searchParams.get("data"));
  formData.assessmentID = searchParams.get("assessmentID");
  const updateIssueWithId = addIssueAction.bind(null, formData);

  const [formState, formAction] = useActionState(updateIssueWithId, formData);
  useEffect(() => {
    if (formState?.message === "success") {
      console.log("issue saved");
      console.log(formState.data);
    }

    if (formState?.strapiErrors) {
      console.log(formState);
    }
  }, [formState]);

  return (
    <form className={cn("space-y-4", className)} action={formAction}>
      Edit Issues
      {buildForm({ formData })}
      <SubmitButton
        text="Save Issue"
        loadingText="Saving Profile"
        onClick={(e) => e.preventDefault()}
      />
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}
