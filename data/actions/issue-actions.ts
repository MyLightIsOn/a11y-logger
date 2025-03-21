"use server";

import { imageSchema } from "@/static/image-schema";
import {
  fileDeleteService,
  fileUploadService,
} from "@/data/services/file-service";
import { mutateData } from "@/data/services/mutate-data";

export async function addIssueAction(prevState: any) {
  const payload = {
    data: {
      title: prevState.title,
      severity: prevState.severity,
      original_description: prevState.original_description,
      updated_description: prevState.updated_description,
      impact: prevState.impact,
      suggested_fix: prevState.suggested_fix,
      assessment: {
        connect: [`${prevState.assessment_id}`],
      },
      screenshots: prevState.screenshots,
    },
  };

  let responseData;

  if (prevState.documentId) {
    responseData = await mutateData(
      "PUT",
      `/api/issues/${prevState.documentId}`,
      payload,
    );
  }

  if (!prevState.documentId) {
    responseData = await mutateData("POST", `/api/issues`, payload);
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

  return {
    ...prevState,
    success: true,
    message: "Issue Saved",
    data: responseData.data,
    strapiErrors: null,
  };
}

export async function uploadIssueImageAction(formData: any) {
  /*let zodErrors = null;
  let message = null;
  let strapiErrors = null;
  const images = formData.data;
  const savedImagesIds: Array<string> = [];

  if (images) {
    images.map((image: any) => {
      // VALIDATE THE IMAGE
      const validatedFields = imageSchema.safeParse({
        image: image,
      });
      if (!validatedFields.success) {
        zodErrors = validatedFields.error.flatten().fieldErrors;
        message = "Invalid Image";
      }
    });

    const promises = images.map((image: any) => {
      // Return the Promise created by the async function
      return fileUploadService(image)
        .then((fileUploadResponse) => {
          // Handle successful response
          if (!fileUploadResponse) {
            message = "Ops! Something went wrong. Please try again.";
            return "Ops! Something went wrong. Please try again.";
          }
          if (fileUploadResponse.error) {
            // Handle error in response
            strapiErrors = fileUploadResponse.error;
            message = "Failed to Upload File.";
            return "Failed to Upload File.";
          }

          // Handle successful upload
          return fileUploadResponse;
        })
        .catch((_err) => {
          // Handle error during the API call
          return "Failed to Upload File.";
        });
    });

    return Promise.all(promises)
      .then((values) => {
        // Every promise has resolved

        values.map((value: any) => {
          savedImagesIds.push(value[0].id);
          console.log(savedImagesIds);
        });

        return {
          strapiErrors: strapiErrors,
          zodErrors: zodErrors,
          message: message,
          success: true,
          data: savedImagesIds,
        };
      })
      .catch((error) => {
        // Any promise rejected
        console.log(error);
      });
  }
  return {
    strapiErrors: strapiErrors,
    zodErrors: zodErrors,
    message: message,
    success: true,
  };*/

  console.log("IMAGE ACTION------------------------------->");

  return {
    strapiErrors: null,
    zodErrors: null,
    message: "none",
    success: true,
  };
}
