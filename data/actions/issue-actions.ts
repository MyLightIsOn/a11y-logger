"use server";
import qs from "qs";
import { revalidatePath } from "next/cache";

import { mutateData } from "@/data/services/mutate-data";
import { BASE_URL } from "@/static/const";

export async function addIssueAction(
  userId: string,
  prevState: any,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    description: rawFormData.description,
  };

  try {
    // Send a POST request to the API route
    const res = await fetch(`http://localhost:3000/api/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: payload.description,
      }), // Example user input
    });

    const responseData = await res.json();

    if (responseData.success) {
      return {
        ...prevState,
        message: "Test",
        data: { test: responseData },
        strapiErrors: null,
      };
    } else {
      return {
        ...prevState,
        strapiErrors: responseData.error,
        message: "Failed to Update Profile.",
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
