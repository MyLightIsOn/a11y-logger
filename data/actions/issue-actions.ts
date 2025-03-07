"use server";

import { z } from "zod";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { imageSchema } from "@/static/image-schema";
import {
  fileDeleteService,
  fileUploadService,
} from "@/data/services/file-service";
import { mutateData } from "@/data/services/mutate-data";
import { revalidatePath } from "next/cache";

export async function analyzeIssueAction(
  userId: string,
  assessment_id: string,
  prevState: any,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    description: rawFormData.description,
  };

  try {
    // Send a POST request to the API route
    const res = await fetch(`http://localhost:3000/api/analyze-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: payload.description,
      }), // Example user input
    });

    const responseData = await res.json();
    responseData.assessment_id = assessment_id;

    if (responseData.success) {
      return {
        ...prevState,
        message: "Success",
        data: responseData,
        strapiErrors: null,
      };
    } else {
      return {
        ...prevState,
        strapiErrors: responseData.error,
        message: "Issue Analysis Failed",
      };
    }
  } catch (error) {
    return {
      ...prevState,
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }
}

export async function addIssueAction(prevState: any, formData: FormData) {
  const payload = {
    data: {
      id: formData.id,
      title: formData.title,
      severity: formData.severity,
      original_description: formData.original_description,
      updated_description: formData.updated_description,
      impact: formData.impact,
      suggested_fix: formData.suggested_fix,
      assessment: {
        connect: [`${formData.assessment_id}`],
      },
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
    return {
      success: false,
      error: error,
    };
  }
}

export async function uploadIssueImageAction(
  imageId: string,
  prevState: any,
  formData: FormData,
) {
  let zodErrors = null;
  let message = null;
  let strapiErrors = null;
  let imageData = null;
  let images = formData.getAll("image");
  let savedImagesIds = [];

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

  Promise.all(promises)
    .then((values) => {
      // Every promise has resolved

      values.map((value: any) => {
        savedImagesIds.push(value[0].id);
      });
    })
    .catch((error) => {
      // Any promise rejected
      console.log(error);
    });

  console.log("SAVING IMAGE!");

  return {
    strapiErrors: strapiErrors,
    zodErrors: zodErrors,
    message: message,
    imageData: savedImagesIds,
  };
}
