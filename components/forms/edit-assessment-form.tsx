"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SubmitButton } from "@/components/custom/submit-button";
import { StrapiErrors } from "@/components/custom/strapi-errors";

const addAssessmentForm = {
  title: "",
  description: "",
  platform: "",
  standard: "",
};

const postAssessment = async (formData) => {
  const api_url = `/api/assessments`;
  try {
    const res = await axios.post(api_url, formData);
    return res;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

function EditAssessmentForm() {
  const [formData, setFormData] = React.useState(addAssessmentForm);

  return (
    <form action={() => postAssessment(formData)}>
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
      <StrapiErrors error={formData?.strapiErrors} />
    </form>
  );
}

export default EditAssessmentForm;
