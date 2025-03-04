"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { SubmitButton } from "@/components/custom/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { addIssueAction } from "@/data/actions/issue-actions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { toast } from "sonner";

const buildForm = ({ formData }) => {
  const form: React.JSX.Element[] = [];

  Object.keys(formData).forEach((key) => {
    const displayTitle = snakeCaseToTitleCase(key);
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
  const router = useRouter();

  const formData = JSON.parse(searchParams.get("data") as string);
  formData.assessment_id = searchParams.get("assessment_id");

  const updateIssueWithId = addIssueAction.bind(null, formData);

  const [formState, formAction] = useActionState(updateIssueWithId, formData);
  useEffect(() => {
    if (formState.success) {
      toast.success("Issue saved");
      router.push(`/assessments/${formData.assessment_id}`);
    }

    if (formState.error) {
      toast.error("Error while saving");
      console.log(formState.error);
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
