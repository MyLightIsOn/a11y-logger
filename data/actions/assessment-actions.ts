"use server";

import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { mutateData } from "@/data/services/mutate-data";

export async function addAssessmentAction(prevState: any) {
  const user = await getUserMeLoader();
  const payload = {
    data: {
      title: prevState.title,
      description: prevState.description,
      platform: prevState.platform,
      standard: prevState.standard,
      users_permissions_user: {
        connect: [user.data.documentId],
      },
    },
  };

  let responseData;

  if (!prevState.documentId) {
    responseData = await mutateData("POST", `/api/assessments`, payload);
  }

  if (prevState.documentId) {
    responseData = await mutateData(
      "PUT",
      `/api/assessments/${prevState.documentId}`,
      payload,
    );
  }

  if (responseData.error) {
    return {
      success: false,
      error: {
        message:
          "Something went wrong while saving. If this persist, use the details panel below to report this to support.",
      },
      strapiErrors: responseData,
    };
  }

  if (responseData.id) {
    return {
      ...prevState,
      success: true,
      data: responseData,
      strapiErrors: null,
    };
  }

  return {
    ...prevState,
    success: true,
    message: "Assessment Saved",
    data: responseData.data,
    strapiErrors: null,
  };
}
