"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useActionState } from "react";

import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { addIssueAction, editIssueAction } from "@/data/actions/issue-actions";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { Input } from "@/components/ui/input";

interface AddIssueFormProps {
  id: string;
  issue_title: string;
  severity: string;
  original_description: string;
  updated_description: string;
  impact: string;
  suggested_fix: string;
  specs: string;
}

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

const INITIAL_STATE = {
  id: null,
  issue_title: null,
  severity: null,
  original_description: null,
  updated_description: null,
  impact: null,
  suggested_fix: null,
  specs: null,
};

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
          key={key}
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          defaultValue={formData[key] || ""}
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

  const updateIssueWithId = editIssueAction.bind(null, formData);

  const [formState, formAction] = useActionState(
    updateIssueWithId,
    INITIAL_STATE,
  );

  console.log(formState);

  return (
    <form className={cn("space-y-4", className)}>
      Edit Issues
      {buildForm({ formData })}
    </form>
  );
}
