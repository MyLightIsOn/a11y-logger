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
  const uploadIssueImageAction = uploadProfileImageAction.bind(null, data?.id);

  const [formState, formAction] = useActionState(
    uploadIssueImageAction,
    initialState,
  );

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

/*function AddIssueImagesForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      // Send formData to the server
      // Example:
      // fetch('/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      console.log("Files to upload:", selectedFiles);
    }
  };

  return (
      <div>
        <form className={cn("space-y-4", className)} action={formAction}>
          <div className="">
            <ImagePicker
                id="image"
                name="image"
                label="Profile Image"
                defaultValue={data?.url || ""}
            />
            <ZodErrors error={formState?.zodErrors?.image}/>
            <StrapiErrors error={formState?.strapiErrors}/>
          </div>
          <div className="flex justify-end">
            <SubmitButton text="Update Image" loadingText="Saving Image"/>
          </div>
        </form>

        {/!*<input type="file" multiple onChange={handleFileChange}/>
        <button onClick={handleUpload}>Upload Files</button>
        {selectedFiles.length > 0 && (
            <div>
              <p>Selected files:</p>
              <ul>
                {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
        )}*!/}
      </div>
  );
}*/

export default AddIssueImagesForm;
