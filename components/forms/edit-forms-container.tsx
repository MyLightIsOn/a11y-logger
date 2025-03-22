"use client";

import { EditIssueForm } from "@/components/forms/edit-issue-form";
import AddIssueImagesForm from "@/components/forms/add-issue-images-form";
import { use, useActionState, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  addIssueAction,
  uploadIssueImageAction,
} from "@/data/actions/issue-actions";
import { SubmitButton } from "@/components/custom/submit-button";

import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleOutlinIcon } from "@/components/icons/circle-alert-2";
import { DataTable } from "@/components/custom/assessments-list/data-table";

const IMAGE_FORM_INITIAL_STATE = {
  message: null,
  data: null,
  strapiErrors: null,
  zodErrors: null,
  imageIds: null,
};

const fetchIssue = async (url: string) => {
  const api_url = `/api/issues?documentId=${url}`;

  try {
    const res = await axios.get(api_url);
    return res.data;
  } catch (err) {
    throw new Error(`Failed to fetch issues: ${err}`);
  }
};

function EditFormsContainer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const url = pathname.split("/");

  const documentId = searchParams.get("documentId");

  let { data, error, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchIssue(documentId),
  });

  const [editFormData, setEditFormData] = useState(data);

  const updateIssueWithId = addIssueAction.bind(null, {
    data: JSON.stringify(editFormData),
    documentId: documentId,
    assessment_id: url[2],
  });
  const [editFormState, editFormAction] = useActionState(
    updateIssueWithId,
    editFormData,
  );

  useEffect(() => {
    setEditFormData(data);
  }, [data]);

  const router = useRouter();

  const [imageFormState, imageFormAction] = useActionState(
    uploadIssueImageAction,
    IMAGE_FORM_INITIAL_STATE,
  );

  const [selectedImages, setSelectedImages] = useState();

  // TODO put image ids back so you can connect images to issues.
  const [imageIds, setImageids] = useState([]);

  useEffect(() => {
    IMAGE_FORM_INITIAL_STATE.data = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    if (imageFormState.success) {
      toast.success("Images saved");
      setEditFormData({
        ...editFormData,
        screenshots: imageFormState.data,
      });
      setImageids(imageFormState.data);
    }
  }, [imageFormState]);

  useEffect(() => {
    if (imageFormState.success) {
      const form = document.getElementById("issue-form");

      form?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  }, [imageIds]);

  return (
    <>
      {isLoading ? (
        <>
          <div className={"flex justify-between mb-4 px-10 pt-10"}>
            <Skeleton className={"w-1/3 h-10"} />
            <Skeleton className={"w-[120px] h-10"} />
          </div>
          <div className={"px-10"}>
            <Skeleton className={"w-full h-[500px]"} />
          </div>
        </>
      ) : error ? (
        <div className={"flex items-center align-middle h-full"}>
          <div className={"flex flex-col mx-auto justify-center text-center"}>
            <AlertCircleOutlinIcon className={"mb-4"} height={"3em"} />
            <p className={"mb-4"}>Uh oh, something went wrong!</p>
            <p className={"mb-4 italic text-sm"}>
              Make note of the error below & contact{" "}
              <a className={"underline"} href="mailto:test@test.com">
                support
              </a>
              :
            </p>
            <p className={"border p-4 dark:bg-gray-900"}>
              Error: {error.message}
            </p>
          </div>
        </div>
      ) : (
        editFormData && (
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
        )
      )}
    </>
  );
}

export default EditFormsContainer;
