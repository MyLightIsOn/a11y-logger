"use client";
import React, { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import ImagePicker from "@/components/custom/image-picker";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from "@/components/custom/submit-button";
import { uploadProfileImageAction } from "@/data/actions/profile-actions";
import { uploadIssueImageAction } from "@/data/actions/issue-actions";

const initialState = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
};

export function AddIssueImagesForm({
  data,
  className,
}: {
  data: any;
  className?: string;
}) {
  const uploadIssueImageWithIdAction = uploadIssueImageAction.bind(
    null,
    data?.id,
  );

  const [formState, formAction] = useActionState(
    uploadIssueImageWithIdAction,
    initialState,
  );

  //console.log(formState);

  return (
    <form className={cn("space-y-4", className)} action={formAction}>
      <div className="">
        <ImagePicker
          id="image"
          name="image"
          label="Profile Image"
          defaultValue={data?.url || ""}
          multiple
        />
        <ZodErrors error={formState?.zodErrors?.image} />
        <StrapiErrors error={formState?.strapiErrors} />
      </div>
      <div className="flex justify-end">
        <SubmitButton text="Update Image" loadingText="Saving Image" />
      </div>
    </form>
  );
}

export default AddIssueImagesForm;
