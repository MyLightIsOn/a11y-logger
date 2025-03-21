"use client";

import { EditIssueForm } from "@/components/forms/edit-issue-form";
import AddIssueImagesForm from "@/components/forms/add-issue-images-form";
import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addIssueAction,
  uploadIssueImageAction,
} from "@/data/actions/issue-actions";
import { SubmitButton } from "@/components/custom/submit-button";

import { toast } from "sonner";

const IMAGE_FORM_INITIAL_STATE = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
  imageIds: null,
};

function EditFormsContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParamData = JSON.parse(searchParams.get("data") as string);

  searchParamData.assessment_id = searchParams.get("assessment_id");

  const [editFormData, setEditFormData] = useState(searchParamData);
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

  const [imageIds, setImageids] = useState([]);

  useEffect(() => {
    IMAGE_FORM_INITIAL_STATE.data = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    if (imageFormState.data) {
      toast.success("Images saved");
      setEditFormData({
        ...editFormData,
        screenshots: imageFormState.data,
      });
      setImageids(imageFormState.data);
    }

    if (imageFormState.success) {
      const form = document.getElementById("issue-form");

      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
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
        setEditFormData={setEditFormData}
      />
      <SubmitButton
        form="issue-image-form"
        text="Save Issue"
        loadingText="Save Issue"
      />
    </div>
  );
}

export default EditFormsContainer;
