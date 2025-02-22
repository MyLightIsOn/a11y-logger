"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { useActionState } from "react";

import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { addIssueAction } from "@/data/actions/issue-actions";

const INITIAL_STATE = {
  data: null,
  strapiErrors: null,
  message: null,
};

interface AddIssueFormProps {
  id: string;
  description: string;
}

export function AddIssueForm({
  data,
  className,
}: {
  readonly data: AddIssueFormProps;
  readonly className?: string;
}) {
  const updateIssueWithId = addIssueAction.bind(null, data.id);

  const [formState, formAction] = useActionState(
    updateIssueWithId,
    INITIAL_STATE,
  );

  return (
    <form className={cn("space-y-4", className)} action={formAction}>
      <div className="space-y-4 grid ">
        <Textarea
          id="description"
          name="description"
          placeholder="Write issue description here..."
          className="resize-none border rounded-md w-full h-[224px] p-2"
          defaultValue={data?.description || ""}
          required
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton text="Next" loadingText="Analyzing Issue" />
      </div>
      <StrapiErrors error={formState?.strapiErrors} />
    </form>
  );
}
