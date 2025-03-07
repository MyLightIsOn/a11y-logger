"use client";

import { EditIssueForm } from "@/components/forms/edit-issue-form";
import AddIssueImagesForm from "@/components/forms/add-issue-images-form";
import { use, useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addIssueAction,
  uploadIssueImageAction,
} from "@/data/actions/issue-actions";
import { toast } from "sonner";

const IMAGE_FORM_INITIAL_STATE = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
};

function EditFormsContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editFormData = JSON.parse(searchParams.get("data") as string);
  editFormData.assessment_id = searchParams.get("assessment_id");

  const updateIssueWithId = addIssueAction.bind(null, editFormData);
  const [editFormState, editFormAction] = useActionState(
    updateIssueWithId,
    editFormData,
  );

  const [imageFormState, imageFormAction] = useActionState(
    uploadIssueImageAction,
    IMAGE_FORM_INITIAL_STATE,
  );

  const [selectedImages, setSelectedImages] = useState();

  useEffect(() => {
    IMAGE_FORM_INITIAL_STATE.data = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    if (imageFormState.success) {
      toast.success("Images saved");
    }
  }, [imageFormState]);

  return (
    <div className={"p-4"}>
      <AddIssueImagesForm
        imageFormState={imageFormState}
        imageFormAction={imageFormAction}
        setSelectedImages={setSelectedImages}
      />
      <EditIssueForm
        editFormState={editFormState}
        editFormAction={editFormAction}
        editFormData={editFormData}
        router={router}
      />
    </div>
  );
}

export default EditFormsContainer;
