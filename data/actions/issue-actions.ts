"use server";
import qs from "qs";
import { revalidatePath } from "next/cache";

import { mutateData } from "@/data/services/mutate-data";

export async function addIssueAction(
  userId: string,
  prevState: any,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData);

  const payload = {
    description: rawFormData.description,
  };

  console.log(payload);

  return {
    ...prevState,
    message: "Test",
    data: { test: "test" },
    strapiErrors: null,
  };

  /*if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      message: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      message: "Failed to Update Profile.",
    };
  }

  revalidatePath("/dashboard/account");

  return {
    ...prevState,
    message: "Profile Updated",
    data: responseData,
    strapiErrors: null,
  };*/
}
