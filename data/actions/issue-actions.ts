"use server";

import { z } from "zod";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
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

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// VALIDATE IMAGE WITH ZOD
const imageSchema = z.object({
  image: z
    .any()
    .refine((file) => {
      if (file.size === 0 || file.name === undefined) return false;
      else return true;
    }, "Please update or add new image.")

    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    )
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`),
});

export async function uploadIssueImageAction(
  imageId: string,
  prevState: any,
  formData: FormData,
) {
  // GET THE LOGGED IN USER

  console.log("LOGGED IN!");

  return {
    strapiErrors: null,
    zodErrors: null,
    message: "Image Uploaded",
  };
}
