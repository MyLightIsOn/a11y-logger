import { Button } from "@/components/ui/button";
import React from "react";
import { Feature } from "@/components/icons/feature";

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

export const sharingAssessments = {
  title: (
    <p className={"flex items-center"}>
      Assessment Sharing <Feature className={"ml-2"} height={"1em"} />
    </p>
  ),
  description: "Share your assessments with stakeholders",
  content: (
    <>
      <p>
        Sharing assessments will let you share your completed assessments with
        collagues, stakeholders, etc.
      </p>
      <p className={"text-sm italic flex"}>
        This is a planned feature that is either being worked on or will be
        added soon. If you are interested in this feature, let us know. The more
        interest we get, the higher we will prioritize this feature.
      </p>
    </>
  ),
  actions: undefined,
};
