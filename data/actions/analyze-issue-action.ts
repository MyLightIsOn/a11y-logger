"use server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";

export async function analyzeIssueAction(assessment_id: string, formData: any) {
  const user = await getUserMeLoader();
  if (!user.ok)
    throw new Error("You are not authorized to perform this action.");
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
    if (responseData.success) {
      return {
        message: "Success",
        data: responseData,
        strapiErrors: null,
      };
    } else {
      return {
        strapiErrors: responseData.error,
        message: "Issue Analysis Failed",
      };
    }
  } catch (error) {
    return {
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }
}
