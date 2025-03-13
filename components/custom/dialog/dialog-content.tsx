import { Button } from "@/components/ui/button";
import React from "react";

export const dialogTestContent = {
  title: "Test Title",
  description: "Test description",
  content: <p>Test description</p>,
  actions: [
    <Button key={"submit-dialog"} type="submit">
      Save
    </Button>,
    <Button key={"cancel-dialog"}>Cancel</Button>,
  ],
};
