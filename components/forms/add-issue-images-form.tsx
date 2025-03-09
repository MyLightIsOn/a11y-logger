"use client";
import { cn } from "@/lib/utils";
import ImagePicker from "@/components/custom/image-picker";
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";

export function AddIssueImagesForm({
  className,
  imageFormState,
  imageFormAction,
  setSelectedImages,
}: {
  className?: string;
  imageFormState: any;
  imageFormAction: any;
  setSelectedImages: any;
}) {
  return (
    <form
      className={cn("space-y-4", className)}
      id={"issue-image-form"}
      action={imageFormAction}
    >
      <div className="">
        <ImagePicker
          id="image"
          name="image"
          label="Profile Image"
          multiple
          setSelectedImages={setSelectedImages}
        />
        <ZodErrors error={imageFormState?.zodErrors?.image} />
        <StrapiErrors error={imageFormState?.strapiErrors} />
      </div>
    </form>
  );
}

export default AddIssueImagesForm;
