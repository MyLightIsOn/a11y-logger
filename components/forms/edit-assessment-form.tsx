"use client";

import React from "react";
import { Input } from "@/components/ui/input";
/*
 * title
 * description
 * platform
 * standard
 * tags
 * */
const addAssessmentForm = {
  name: "",
};

function EditAssessmentForm() {
  const [formData, setFormData] = React.useState(addAssessmentForm);

  return (
    <form>
      <Input
        name="assessmentName"
        id="assessmentNameInput"
        placeholder={"Assessment Name"}
        defaultValue={formData.name || ""}
        onChange={(e) => {
          setFormData({ ...formData, name: e.target.value });
        }}
      />
    </form>
  );
}

export default EditAssessmentForm;
