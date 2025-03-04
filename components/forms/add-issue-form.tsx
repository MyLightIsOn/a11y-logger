"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useActionState } from "react";

import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { analyzeIssueAction } from "@/data/actions/issue-actions";
import { usePathname, useRouter } from "next/navigation";
import qs from "qs";

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
  const pathname = usePathname();
  const editIssuePath = pathname.replace("/add-issue", "");
  const assessment_id = editIssuePath.replace("/assessments/", "");

  const updateIssueWithId = analyzeIssueAction.bind(
    null,
    data.id,
    assessment_id,
  );

  const [formState, formAction] = useActionState(
    updateIssueWithId,
    INITIAL_STATE,
  );

  const router = useRouter();

  useEffect(() => {
    if (formState?.data?.success) {
      console.log("analyzation complete");
      const query = qs.stringify(formState.data);
      router.push(`${editIssuePath}/edit-issue?${query}`);
    }
  }, [formState]);

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
