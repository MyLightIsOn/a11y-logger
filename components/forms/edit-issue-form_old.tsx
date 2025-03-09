"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/components/custom/submit-button";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { Input } from "@/components/ui/input";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { toast } from "sonner";

interface editFormData {
  [key: string]: any; // This can be more specific, depending on the structure of your editFormData
}

const buildForm = ({ editFormData }: editFormData) => {
  const form: React.JSX.Element[] = [];
  Object.keys(editFormData).forEach((key: string) => {
    const displayTitle = snakeCaseToTitleCase(key);
    const formKey = key;
    const formValue = editFormData[key];
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

export function EditIssueForm({
  className,
  editFormState,
  editFormAction,
  editFormData,
  router,
}: {
  readonly className?: string;
  editFormState: any;
  editFormAction: any;
  editFormData: any;
  router: any;
}) {
  useEffect(() => {
    if (editFormState.success) {
      toast.success("Issue saved");
      router.push(`/assessments/${editFormData.assessment_id}`);
    }

    if (editFormState.error) {
      toast.error("Error while saving");
      console.log(editFormState.error);
    }
  }, [editFormState]);

  return (
    <form
      id={"issue-form"}
      className={cn("space-y-4", className)}
      action={editFormAction}
    >
      Edit Issues
      {buildForm({ editFormData })}
      {/*<SubmitButton text="Save Issue" loadingText="Saving Issue" />*/}
      <StrapiErrors error={editFormState?.strapiErrors} />
    </form>
  );
}
