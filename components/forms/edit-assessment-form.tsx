"use client";

import React, { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { toast } from "sonner";
import { addAssessmentAction } from "@/data/actions/assessment-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const addAssessmentForm = {
  title: "",
  description: "",
  platform: "",
  standard: "",
};

const fetchAssessment = async (url: string, formData) => {
  if (url) {
    const api_url = `/api/assessments?documentId=${url}`;

    try {
      const res = await axios.get(api_url);
      return res.data;
    } catch (err) {
      throw new Error(`Failed to fetch issues: ${err}`);
    }
  }
  return formData;
};

function EditAssessmentForm() {
  const searchParams = useSearchParams();
  const editAssessmentId = searchParams.get("id") as string;
  const [formData, setFormData] = React.useState(addAssessmentForm);
  const [showDetails, setShowDetails] = React.useState(false);
  const addAssessment = addAssessmentAction.bind(null, formData);
  const [editFormState, editFormAction] = useActionState(
    addAssessment,
    formData,
  );
  const router = useRouter();

  let { data, error, isLoading } = useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchAssessment(editAssessmentId, formData),
  });

  useEffect(() => {
    if (editAssessmentId) {
      fetchAssessment(editAssessmentId, null)
        .then((res) => {
          setFormData(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (editFormState.success) {
      toast.success("Assessment Saved.");
      router.push(`/assessments/${editFormState.data.documentId}`);
    }

    if (editFormState.error) {
      console.log(editFormState);
      toast.error(
        "Uh oh! Something went wrong. If this error persists, contact support",
      );
    }
  }, [editFormState]);

  return (
    <>
      <form action={editFormAction}>
        <Input
          name="title"
          id="titleInput"
          placeholder={"Assessment Name"}
          defaultValue={formData.title || ""}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
        />
        <Input
          name="description"
          id="descriptionInput"
          placeholder={"Description"}
          defaultValue={formData.description || ""}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
        />
        <Input
          name="platform"
          id="platformInput"
          placeholder={"Platform"}
          defaultValue={formData.platform || ""}
          onChange={(e) => {
            setFormData({ ...formData, platform: e.target.value });
          }}
        />
        <Input
          name="standard"
          id="standardInput"
          placeholder={"Standard"}
          defaultValue={formData.standard || ""}
          onChange={(e) => {
            setFormData({ ...formData, standard: e.target.value });
          }}
        />
        <SubmitButton text="Save Assessment" loadingText="Saving" />
        <StrapiErrors error={editFormState.error} />
      </form>
      {showDetails && <span>{editFormState.strapiErrors?.error}</span>}

      {editFormState.error && (
        <Button variant={"ghost"} onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      )}
    </>
  );
}

export default EditAssessmentForm;
