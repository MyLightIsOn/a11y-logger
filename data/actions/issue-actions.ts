"use server";

import { imageSchema } from "@/static/image-schema";
import {
  fileDeleteService,
  fileUploadService,
} from "@/data/services/file-service";

export async function addIssueAction(prevState: any) {
  const payload = {
    data: {
      id: prevState.id,
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

  try {
    // Send a POST request to the API route
    const res = await fetch(`http://localhost:3000/api/issues`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Example user input
    });

    const responseData = await res.json();

    if (responseData.error) {
      console.log(responseData.error);
      return {
        success: false,
        error: responseData.error,
      };
    }

    if (responseData.data.id) {
      return {
        ...prevState,
        success: true,
        data: responseData.data.data,
        strapiErrors: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: error,
    };
  }
}

export async function uploadIssueImageAction(formData: any) {
  let zodErrors = null;
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
    data: savedImagesIds,
  };
}
